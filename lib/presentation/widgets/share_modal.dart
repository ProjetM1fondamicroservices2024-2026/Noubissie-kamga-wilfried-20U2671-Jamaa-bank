import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:jamaa_frontend_mobile/core/theme/app_theme.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/qr_code_dialog.dart';
import 'package:jamaa_frontend_mobile/presentation/widgets/share_option.dart';

class ShareModal extends StatelessWidget {
  final String cardNumber;
  final String accountName;

  const ShareModal({
    super.key,
    required this.cardNumber,
    required this.accountName,
  });

  Future<void> _copyToClipboard(BuildContext context) async {
    await Clipboard.setData(ClipboardData(text: cardNumber));
    
    if (context.mounted) {
      Navigator.pop(context);
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Numéro de carte copié : $cardNumber'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
    }
  }

  void _showQRCode(BuildContext context) {
    Navigator.pop(context); // Fermer le modal de partage
    
    showDialog(
      context: context,
      builder: (context) => QRCodeDialog(
        cardNumber: cardNumber,
        accountName: accountName,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    final bottomPadding = MediaQuery.of(context).viewInsets.bottom;
    final bottomSafeArea = MediaQuery.of(context).padding.bottom;
    
    // Calcul de la hauteur maximale du modal (70% de l'écran)
    final maxHeight = screenHeight * 0.7;
    
    return Container(
      constraints: BoxConstraints(
        maxHeight: maxHeight,
        maxWidth: screenWidth,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Contenu principal avec scroll si nécessaire
          Flexible(
            child: SingleChildScrollView(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                bottom: bottomPadding + bottomSafeArea + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 24),
                  
                  // Titre
                  Text(
                    'Partager votre numéro de compte',
                    style: TextStyle(
                      fontSize: screenWidth < 360 ? 16 : 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[800],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Numéro de compte
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(screenWidth < 360 ? 12 : 16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.credit_card,
                          color: AppTheme.primaryColor,
                          size: screenWidth < 360 ? 18 : 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                accountName,
                                style: TextStyle(
                                  fontSize: screenWidth < 360 ? 10 : 12,
                                  color: Colors.grey,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                cardNumber,
                                style: TextStyle(
                                  fontSize: screenWidth < 360 ? 14 : 16,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 1.0,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Options de partage
                  Column(
                    children: [
                      // Bouton Copier
                      ShareOption(
                        icon: Icons.copy,
                        title: 'Copier le numéro',
                        subtitle: 'Copier dans le presse-papiers',
                        onTap: () => _copyToClipboard(context),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Bouton QR Code
                      ShareOption(
                        icon: Icons.qr_code,
                        title: 'Afficher le QR Code',
                        subtitle: 'Générer un code QR à scanner',
                        onTap: () => _showQRCode(context),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Bouton Annuler
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.symmetric(
                          vertical: screenWidth < 360 ? 12 : 16,
                        ),
                      ),
                      child: Text(
                        'Annuler',
                        style: TextStyle(
                          fontSize: screenWidth < 360 ? 14 : 16,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}