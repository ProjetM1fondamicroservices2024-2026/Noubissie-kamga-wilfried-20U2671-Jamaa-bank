  import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/build_success_detail_row.dart';

void showSuccessDialog(BuildContext context, String transferType, Map<String, dynamic> transferData) {
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Column(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(40),
                border: Border.all(color: Colors.green[200]!, width: 2),
              ),
              child: Icon(
                Icons.check_circle,
                color: Colors.green[600],
                size: 40,
              ),
            )
                .animate()
                .scale(duration: 600.ms, curve: Curves.elasticOut)
                .then(delay: 200.ms)
                .shimmer(duration: 1000.ms, color: Colors.green.withValues(alpha: 0.3)),
            const SizedBox(height: 16),
            Text(
              'Transfert réussi !',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.green[700],
                fontSize: 20,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
        content: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.green[50],
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.green[200]!),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Votre ${transferType == 'user' ? 'transfert utilisateur' : 'transfert bancaire'} a été effectué avec succès !',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.green[800],
                  fontWeight: FontWeight.w500,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green[200]!),
                ),
                child: Column(
                  children: [
                    buildSuccessDetailRow(
                      'Montant',
                      '${transferData['amount'].toStringAsFixed(0)} XAF',
                      Icons.money,
                      Colors.green[700]!,
                    ),
                    const SizedBox(height: 12),
                    if (transferType == 'user')
                      buildSuccessDetailRow(
                        'Bénéficiaire',
                        transferData['recipient'],
                        Icons.person,
                        Colors.blue[700]!,
                      )
                    else 
                      buildSuccessDetailRow(
                        'Compte destinataire',
                        transferData['receiverAccountNumber'],
                        Icons.credit_card,
                        Colors.blue[700]!,
                      ),
                    const SizedBox(height: 12),
                    buildSuccessDetailRow(
                      'Date et heure',
                      _getCurrentDateTime(),
                      Icons.schedule,
                      Colors.grey[700]!,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          Container(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green[600],
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              onPressed: () {
                // Fermer le dialog et retourner aux écrans précédents
                Navigator.pop(context); // Fermer le dialog
                Navigator.pop(context); // Retourner à l'écran de transfert
                Navigator.pop(context); // Retourner au dashboard
              },
              child: const Text(
                'Retour au tableau de bord',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ),
        ],
      ),
    );

}
    String _getCurrentDateTime() {
    final now = DateTime.now();
    return '${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}';
  }