import 'package:flutter/material.dart';
import 'package:jamaa_frontend_mobile/core/providers/auth_provider.dart';
import 'package:jamaa_frontend_mobile/core/providers/transfert_provider.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/show_error_dialog.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/show_success_dialog.dart';
import 'package:jamaa_frontend_mobile/utils/account_service.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> processUserTransfer(BuildContext context, TextEditingController _pinController, Map<String, dynamic> transferData) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final transfertProvider = Provider.of<TransfertProvider>(context, listen: false);
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

    // Récupérer les informations du transfert avec vérification de sécurité
    final recipientPhone = transferData['recipient'] as String?;
    final amount = transferData['amount'] as double?;
    final senderPhone = authProvider.currentUser!.phone;

    // Vérifier que les données nécessaires sont présentes
    if (recipientPhone == null || recipientPhone.isEmpty) {
      showErrorDialog(
        context,
        'Numéro du bénéficiaire manquant'
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

    debugPrint('[TRANSFER] Début du transfert utilisateur');
    debugPrint('[TRANSFER] Expéditeur: $senderPhone');
    debugPrint('[TRANSFER] Bénéficiaire: $recipientPhone');
    debugPrint('[TRANSFER] Montant: $amount XAF');

    // Vérifier qu'on ne transfère pas vers soi-même
    if (senderPhone == recipientPhone) {
      showErrorDialog(
        context,
        'Vous ne pouvez pas effectuer un transfert vers votre propre compte'
      );
      return;
    }

    try {
      // Étape 1: Récupérer l'ID du compte expéditeur
      debugPrint('[TRANSFER] Récupération de l\'ID du compte expéditeur...');
      final senderAccountId = await AccountService.getAccountIdByPhone(senderPhone);
      
      if (senderAccountId == null) {
        showErrorDialog(
          context,
          'Impossible de récupérer votre compte. Veuillez réessayer.'
        );
        return;
      }
      
      debugPrint('[TRANSFER] ID compte expéditeur: $senderAccountId');

      // Étape 2: Récupérer l'ID du compte bénéficiaire
      debugPrint('[TRANSFER] Récupération de l\'ID du compte bénéficiaire...');
      final receiverAccountId = await  AccountService.getAccountIdByPhone(recipientPhone);
      
      if (receiverAccountId == null) {
        showErrorDialog(
          context,
          'Le bénéficiaire n\'a pas été trouvé. Vérifiez le numéro bénéficiaire.'
        );
        return;
      }
      
      debugPrint('[TRANSFER] ID compte bénéficiaire: $receiverAccountId');

      // Étape 3: Effectuer le transfert
      debugPrint('[TRANSFER] Exécution du transfert...');
      final success = await transfertProvider.makeAppTransfert(
        senderAccountId: senderAccountId,
        receiverAccountId: receiverAccountId,
        amount: amount,
      );

      if (success) {
        debugPrint('[TRANSFER] Transfert réussi!');
        showSuccessDialog(
          context,
          transferData['type'] as String,
          transferData);
      } else {
        debugPrint('[TRANSFER] Échec du transfert: ${transfertProvider.error?.message}');
        showErrorDialog(
          context,
          transfertProvider.error?.message ?? 'Le transfert a échoué. Veuillez réessayer.'
        );
      }

    } catch (e) {
      debugPrint('[TRANSFER] Erreur lors du transfert: $e');
      showErrorDialog(
        context,
        'Erreur lors du transfert: ${e.toString()}'
      );
    }
  }