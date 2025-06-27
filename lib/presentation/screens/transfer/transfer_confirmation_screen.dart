import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/build_finalcial_row.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/build_pin_section.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/process_bank_tranfer.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/process_user_transfer.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/show_error_dialog.dart';
import 'package:jamaa_frontend_mobile/utils/utils.dart';
import 'package:provider/provider.dart';

import '../../../core/providers/transaction_provider.dart';
import '../../../core/providers/transfert_provider.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/card_provider.dart';
import '../../../core/providers/bank_provider.dart';
import '../../widgets/loading_button.dart';

class TransferConfirmationScreen extends StatefulWidget {
  final Map<String, dynamic> transferData;

  const TransferConfirmationScreen({
    super.key,
    required this.transferData,
  });

  @override
  State<TransferConfirmationScreen> createState() => _TransferConfirmationScreenState();
}

class _TransferConfirmationScreenState extends State<TransferConfirmationScreen> {
  final _pinController = TextEditingController();
  bool _isProcessing = false;

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Confirmation du transfert'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Récapitulatif du transfert
            _buildTransferSummary(theme),
            
            const SizedBox(height: 20),
            
            // Détails de la transaction
            _buildTransferDetails(theme),
            
            const SizedBox(height: 20),
            
            // Frais de transfert
            _buildFeesSection(theme),
            
            const SizedBox(height: 20),
            
            // Code PIN
            buildPinSection(theme, _pinController),
            
            const SizedBox(height: 32),
            
            // Boutons d'action
            _buildActionButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildTransferSummary(ThemeData theme) {
    final transferType = widget.transferData['type'] as String;
    final amount = widget.transferData['amount'] as double;
    
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [theme.primaryColor, theme.primaryColor.withValues(alpha: 0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: theme.primaryColor.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // Icône du type de transfert
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(40),
                border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 2),
              ),
              child: Icon(
                _getTransferIcon(transferType),
                size: 40,
                color: Colors.white,
              ),
            )
                .animate()
                .scale(duration: 600.ms, curve: Curves.elasticOut)
                .then(delay: 200.ms)
                .shimmer(duration: 1000.ms, color: Colors.white.withValues(alpha: 0.5)),
            
            const SizedBox(height: 20),
            
            // Montant
            Text(
              '${amount.toStringAsFixed(0)} XAF',
              style: theme.textTheme.displaySmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 1.2,
              ),
            )
                .animate()
                .fadeIn(delay: 300.ms, duration: 600.ms)
                .slideY(begin: 0.3, end: 0),
            
            const SizedBox(height: 8),
            
            // Description
            Text(
              _getTransferDescription(transferType),
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w500,
                color: Colors.white.withValues(alpha: 0.9),
              ),
              textAlign: TextAlign.center,
            )
                .animate()
                .fadeIn(delay: 400.ms, duration: 600.ms)
                .slideY(begin: 0.3, end: 0),
            
            const SizedBox(height: 16),
            
            // Badge de confirmation
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.schedule,
                    size: 16,
                    color: Colors.white,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'En attente de confirmation',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            )
                .animate()
                .fadeIn(delay: 500.ms, duration: 600.ms)
                .slideY(begin: 0.3, end: 0),
          ],
        ),
      ),
    );
  }

  Widget _buildTransferDetails(ThemeData theme) {
    final transferType = widget.transferData['type'] as String;
    
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.receipt_long, color: theme.primaryColor, size: 24),
                const SizedBox(width: 12),
                Text(
                  'Détails du transfert',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.primaryColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            ..._buildTransferDetailRows(transferType, theme),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: 600.ms, duration: 600.ms)
        .slideY(begin: 0.3, end: 0);
  }

  Future<String?> getUserNameByAccountNumber(String accountNumber) async {
    try {
      final transfertProvider = Provider.of<TransfertProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      final userId = await transfertProvider.getUserIdByAccountNumber(accountNumber);
      if (userId == null) return null;
      
      final user = await authProvider.getUserById(userId);
      if (user != null) {
        return '${user.firstName} ${user.lastName}'.toUpperCase();
      }
      
      return null;
    } catch (e) {
      debugPrint('Erreur getUserNameByAccountNumber: $e');
      return null;
    }
  }


List<Widget> _buildTransferDetailRows(String transferType, ThemeData theme) {
  final details = <Widget>[];
  final cardProvider = Provider.of<CardProvider>(context, listen: false);

  debugPrint("==============================");
  
  // Vérifier si c'est un transfert bancaire avant d'accéder à receiverAccountNumber
  if (transferType == 'bank' && widget.transferData['receiverAccountNumber'] != null) {
    cardProvider.getCardBasicInfo(unformatAccountNumber(widget.transferData['receiverAccountNumber']));
  }

  switch (transferType) {
    case 'user':
      details.addAll([
        _buildDetailRow('Bénéficiaire', widget.transferData['recipient'] ?? 'Non spécifié', theme, Icons.person),
        // Utiliser FutureBuilder pour gérer l'appel asynchrone
        FutureBuilder<String?>(
          future: getUserNameByAccountNumber(widget.transferData['recipient'] ?? ''),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return _buildDetailRow(
                'Nom', 
                'Chargement...', 
                theme, 
                Icons.note,
                trailing: SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              );
            } else if (snapshot.hasError) {
              return _buildDetailRow('Nom', 'Erreur de chargement', theme, Icons.note);
            } else {
              return _buildDetailRow(
                'Nom', 
                snapshot.data ?? 'Nom indisponible', 
                theme, 
                Icons.note
              );
            }
          },
        ),
        _buildDetailRow('Type', 'Transfert utilisateur', theme, Icons.swap_horiz),
      ]);
      break;
    case 'bank':
      details.addAll([
        _buildDetailRow('Banque expéditrice', widget.transferData['senderBankName'] ?? 'Non spécifiée', theme, Icons.account_balance),
        _buildDetailRow('Compte destinataire', widget.transferData['receiverAccountNumber'] ?? 'Non spécifié', theme, Icons.credit_card),
        _buildDetailRow('Type', 'Transfert bancaire', theme, Icons.swap_horiz),
      ]);
      break;
  }
  
  details.addAll([
    _buildDetailRow('Montant', '${(widget.transferData['amount'] as double? ?? 0.0).toStringAsFixed(0)} XAF', theme, Icons.money),
    _buildDetailRow('Date', _getCurrentDateTime(), theme, Icons.schedule),
  ]);
  
  return details;
}

String _getCurrentDateTime() {
    final now = DateTime.now();
    return '${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}';
  }

Widget _buildDetailRow(String label, String value, ThemeData theme, IconData icon, {Widget? trailing}) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 16),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: theme.primaryColor.withValues(alpha: 0.7)),
        const SizedBox(width: 12),
        SizedBox(
          width: 120,
          child: Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface,
            ),
          ),
        ),
        // Ajouter le widget trailing s'il est fourni
        if (trailing != null) ...[
          const SizedBox(width: 8),
          trailing,
        ],
      ],
    ),
  );
}

  Widget _buildFeesSection(ThemeData theme) {
    final amount = widget.transferData['amount'] as double;
    final senderBankId = widget.transferData['senderBankId'] as String?;
    
    return FutureBuilder<double>(
      future: _calculateFees(amount, senderBankId ?? ''),
      builder: (context, snapshot) {
        double fees = 0.0;
        if (snapshot.hasData) {
          fees = snapshot.data!;
        } else if (snapshot.hasError) {
          print('Erreur lors du calcul des frais: ${snapshot.error}');
        }
        
        final total = amount + fees;
        
        return Card(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.calculate, color: theme.primaryColor, size: 24),
                    const SizedBox(width: 12),
                    Text(
                      'Récapitulatif financier',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.primaryColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                buildFinancialRow('Montant du transfert', amount, theme),
                buildFinancialRow('Frais de service', fees, theme),
                
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(thickness: 1),
                ),
                
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: theme.primaryColor.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total à débiter',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: theme.primaryColor,
                        ),
                      ),
                      Text(
                        snapshot.connectionState == ConnectionState.waiting 
                          ? 'Calcul...' 
                          : '${total.toStringAsFixed(0)} XAF',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: theme.primaryColor,
                          fontSize: 20,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<double> _calculateFees(double amount, String senderBankId) async {
    final transferType = widget.transferData['type'] as String;
    
    // Frais différentiés par type de transfert
    if (transferType == 'user') {
      // Frais pour transfert utilisateur
      return 0.0;
    } else {
      // Pour les transferts bancaires, calculer selon les frais de la banque émettrice
      try {
        final bankProvider = Provider.of<BankProvider>(context, listen: false);
        final cardProvider = Provider.of<CardProvider>(context, listen: false);
        
        // Récupérer la banque émettrice
        final senderBank = bankProvider.getBankById(senderBankId);
        if (senderBank == null) {
          print('Banque émettrice non trouvée avec ID: $senderBankId');
          return 0.0;
        }
        
        // Récupérer l'ID de la banque destinataire via le numéro de compte
        final receiverAccountNumber = widget.transferData['receiverAccountNumber'] as String?;
        if (receiverAccountNumber == null) {
          print('Numéro de compte destinataire manquant');
          return 0.0;
        }
        
        // Récupérer les informations de la banque destinataire
        await cardProvider.fetchBankAccountsByCardNumber(receiverAccountNumber);
        final receiverBankAccounts = cardProvider.userBankAccounts;
        
        if (receiverBankAccounts.isEmpty) {
          print('Aucun compte trouvé pour le numéro: $receiverAccountNumber');
          return 0.0;
        }
        
        final receiverBankId = receiverBankAccounts.first.bankId;
        
        // Calculer les frais selon si c'est un transfert interne ou externe
        double feePercentage;
        if (senderBankId == receiverBankId) {
          // Transfert interne - même banque
          feePercentage = senderBank.internalTransferFees;
          print('Transfert interne - Frais: ${feePercentage}%');
        } else {
          // Transfert externe - banques différentes
          feePercentage = senderBank.externalTransferFees;
          print('Transfert externe - Frais: ${feePercentage}%');
        }
        
        final fees = (amount * feePercentage) / 100;
        print('Montant: $amount, Frais calculés: $fees');
        return fees;
        
      } catch (e) {
        print('Erreur lors du calcul des frais: $e');
        return 0.0;
      }
    }
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: Consumer3<TransactionProvider, TransfertProvider, CardProvider>(
            builder: (context, transactionProvider, transfertProvider, cardProvider, child) {
              final isLoading = _isProcessing || transfertProvider.isTransferring || cardProvider.isLoading;
              
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isLoading 
                        ? [Colors.grey, Colors.grey] 
                        : [Colors.green, Colors.green.shade600],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: (isLoading ? Colors.grey : Colors.green).withValues(alpha: 0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: LoadingButton(
                  onPressed: isLoading ? null : _processTransfer,
                  isLoading: isLoading,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Text(
                      'Confirmer le transfert',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        
        const SizedBox(height: 16),
        
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: _isProcessing ? null : () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              side: BorderSide(
                color: _isProcessing ? Colors.grey : Theme.of(context).primaryColor,
                width: 1.5,
              ),
            ),
            child: Text(
              'Modifier les détails',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: _isProcessing ? Colors.grey : Theme.of(context).primaryColor,
              ),
            ),
          ),
        ),
      ],
    )
        .animate()
        .fadeIn(delay: 900.ms, duration: 600.ms)
        .slideY(begin: 0.3, end: 0);
  }

  IconData _getTransferIcon(String transferType) {
    switch (transferType) {
      case 'user':
        return Icons.person_outline;
      case 'bank':
        return Icons.account_balance_outlined;
      default:
        return Icons.send_outlined;
    }
  }

  String _getTransferDescription(String transferType) {
    switch (transferType) {
      case 'user':
        return 'Transfert vers utilisateur JAMAA';
      case 'bank':
        return 'Transfert vers compte bancaire';
      default:
        return 'Transfert';
    }
  }

  Future<void> _processTransfer() async {
    if (_isProcessing) return;

    // Validation du PIN
    if (_pinController.text.trim().length != 4) {
      showErrorDialog(
        context,
        'Veuillez saisir un code PIN à 4 chiffres'
      );
      return;
    }

    setState(() {
      _isProcessing = true;
    });

    try {
      final transferType = widget.transferData['type'] as String;
      
      if (transferType == 'user') {
        await processUserTransfer(context, _pinController, widget.transferData);
      } else if (transferType == 'bank') {
        await processBankTransfer(context, _pinController, widget.transferData);
      } else {
        showErrorDialog(
          context,
          'Type de transfert non supporté'
        );
      }

    } catch (e) {
      debugPrint('[TRANSFER] Erreur inattendue: $e');
      showErrorDialog(
        context,
        'Une erreur inattendue s\'est produite'
      );
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

}