  import 'package:flutter/material.dart';
import 'package:jamaa_frontend_mobile/core/providers/auth_provider.dart';
import 'package:jamaa_frontend_mobile/core/providers/card_provider.dart';
import 'package:jamaa_frontend_mobile/core/providers/transfert_provider.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/show_error_dialog.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/show_success_dialog.dart';
import 'package:jamaa_frontend_mobile/utils/utils.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> processBankTransfer(BuildContext context, TextEditingController _pinController, Map<String, dynamic> transferData) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final transfertProvider = Provider.of<TransfertProvider>(context, listen: false);
    final cardProvider = Provider.of<CardProvider>(context, listen: false);
    final prefs = await SharedPreferences.getInstance();
    final pin = prefs.getString('user_pin');
    
    // Vérifier que l'utilisateur est connecté
    if (authProvider.currentUser == null) {
      showErrorDialog(
        context,
        'Vous devez être connecté pour effectuer un transfert'
      );
      return;
    }

    if (pin != _pinController.text.trim()) {
      showErrorDialog(
        context,
        'Code PIN incorrect'
      );
      return;
    }

    // Récupérer les informations du transfert bancaire avec vérification de sécurité
    final senderBankId = transferData['senderBankId'] as String?;
    final receiverAccountNumber = transferData['receiverAccountNumber'] as String?;
    final amount = transferData['amount'] as double?;

    // Vérifier que les données nécessaires sont présentes
    if (senderBankId == null || senderBankId.isEmpty) {
      showErrorDialog(
        context,
        'ID de la banque expéditrice manquant'
      );
      return;
    }

    if (receiverAccountNumber == null || receiverAccountNumber.isEmpty) {
      showErrorDialog(
        context,
        'Numéro de compte destinataire manquant'
      );
      return;
    }

    if (amount == null || amount <= 0) {
      showErrorDialog(
        context,
        'Montant invalide'
      );
      return;
    }

    final receiverAccountNumberUnformatted = unformatAccountNumber(receiverAccountNumber);

    debugPrint('[BANK_TRANSFER] Début du transfert bancaire');
    debugPrint('[BANK_TRANSFER] Banque expéditrice ID: $senderBankId');
    debugPrint('[BANK_TRANSFER] Compte destinataire: $receiverAccountNumberUnformatted');
    debugPrint('[BANK_TRANSFER] Montant: $amount XAF');

    try {
      // Étape 1: Récupérer les informations de la carte destinataire
      debugPrint('[BANK_TRANSFER] Récupération des informations de la carte destinataire...');
      final cardInfo = await cardProvider.getCardBasicInfo(receiverAccountNumberUnformatted);
      
      if (cardInfo == null) {
        showErrorDialog(
          context,
          'Carte destinataire introuvable. Vérifiez le numéro de compte.'
        );
        return;
      }
      
      debugPrint('[BANK_TRANSFER] Carte trouvée: ${cardInfo.holderName} - ${cardInfo.bankName}');

      // Étape 2: Récupérer l'ID de la banque destinataire
      // On utilise fetchBankAccountsByCardNumber pour obtenir plus d'informations

      await cardProvider.fetchBankAccountsByCardNumber(receiverAccountNumberUnformatted);
      
      if (cardProvider.userBankAccounts.isEmpty) {
        showErrorDialog(
          context,
          'Impossible de récupérer les informations de la banque destinataire.'
        );
        return;
      }

      final receiverBankAccount = cardProvider.userBankAccounts.first;
      final receiverBankId = receiverBankAccount.id;
      
      debugPrint('[BANK_TRANSFER] ID banque destinataire: $receiverBankId');

      // Étape 3: Effectuer le transfert bancaire
      debugPrint('[BANK_TRANSFER] Exécution du transfert bancaire...');
      final success = await transfertProvider.makeBankTransfert(
        senderBankId: int.parse(senderBankId),
        receiverBankId: int.parse(receiverBankId),
        amount: amount,
      );

      if (success) {
        debugPrint('[BANK_TRANSFER] Transfert bancaire réussi! ID: ${transfertProvider.lastBankTransfertId}');
        showSuccessDialog(
          context,
          transferData['type'] as String,
          transferData);
      } else {
        debugPrint('[BANK_TRANSFER] Échec du transfert bancaire: ${transfertProvider.error?.message}');
        showErrorDialog(
          context,
          transfertProvider.error?.message ?? 'Le transfert bancaire a échoué. Veuillez réessayer.'
        );
      }

    } catch (e) {
      debugPrint('[BANK_TRANSFER] Erreur lors du transfert bancaire: $e');
      showErrorDialog(
        context,
        'Erreur lors du transfert bancaire: ${e.toString()}'
      );
    }
  }