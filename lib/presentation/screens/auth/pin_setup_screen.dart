import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PinSetupScreen extends StatefulWidget {
  const PinSetupScreen({super.key});

  @override
  State<PinSetupScreen> createState() => _PinSetupScreenState();
}

class _PinSetupScreenState extends State<PinSetupScreen> {
  String _pin = '';
  String _confirmPin = '';
  bool _isConfirming = false;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screenHeight = MediaQuery.of(context).size.height;
    final isSmallScreen = screenHeight < 700;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Code PIN'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight,
                ),
                child: IntrinsicHeight(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        // Espace adaptatif en haut
                        SizedBox(height: isSmallScreen ? 20 : 40),

                        // Icône avec taille adaptative
                        Container(
                          width: isSmallScreen ? 80 : 100,
                          height: isSmallScreen ? 80 : 100,
                          decoration: BoxDecoration(
                            color: theme.primaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(isSmallScreen ? 40 : 50),
                          ),
                          child: Icon(
                            Icons.security_outlined,
                            size: isSmallScreen ? 40 : 50,
                            color: theme.primaryColor,
                          ),
                        )
                            .animate()
                            .scale(duration: 600.ms, curve: Curves.elasticOut)
                            .then(delay: 200.ms)
                            .shimmer(duration: 1000.ms),

                        SizedBox(height: isSmallScreen ? 20 : 32),

                        // Titre avec taille adaptative
                        Text(
                          _isConfirming ? 'Confirmez votre code PIN' : 'Créez votre code PIN',
                          style: theme.textTheme.headlineLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: isSmallScreen ? 24 : null,
                          ),
                          textAlign: TextAlign.center,
                        )
                            .animate()
                            .fadeIn(delay: 200.ms, duration: 600.ms)
                            .slideY(begin: 0.3, end: 0),

                        SizedBox(height: isSmallScreen ? 12 : 16),

                        // Description
                        Text(
                          _isConfirming
                              ? 'Saisissez à nouveau votre code PIN'
                              : 'Choisissez un code PIN à 4 chiffres pour sécuriser votre compte',
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onBackground.withValues(alpha: 0.7),
                            fontSize: isSmallScreen ? 14 : null,
                          ),
                          textAlign: TextAlign.center,
                        )
                            .animate()
                            .fadeIn(delay: 400.ms, duration: 600.ms)
                            .slideY(begin: 0.3, end: 0),

                        SizedBox(height: isSmallScreen ? 32 : 48),

                        // Affichage des points PIN
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(4, (index) => _buildPinDot(index, isSmallScreen)),
                        )
                            .animate()
                            .fadeIn(delay: 600.ms, duration: 600.ms)
                            .slideY(begin: 0.3, end: 0),

                        // Espace flexible qui s'adapte
                        Flexible(
                          child: SizedBox(height: isSmallScreen ? 20 : 40),
                        ),

                        // Clavier numérique
                        _buildNumericKeypad(isSmallScreen),

                        SizedBox(height: isSmallScreen ? 16 : 24),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildPinDot(int index, bool isSmallScreen) {
    final currentPin = _isConfirming ? _confirmPin : _pin;
    final isFilled = index < currentPin.length;
    final dotSize = isSmallScreen ? 16.0 : 20.0;
    final margin = isSmallScreen ? 8.0 : 12.0;
    
    return Container(
      margin: EdgeInsets.symmetric(horizontal: margin),
      width: dotSize,
      height: dotSize,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isFilled ? Theme.of(context).primaryColor : Colors.transparent,
        border: Border.all(
          color: Theme.of(context).primaryColor.withValues(alpha: 0.5),
          width: 2,
        ),
      ),
    )
        .animate()
        .scale(
          duration: 200.ms,
          curve: Curves.elasticOut,
        );
  }

  Widget _buildNumericKeypad(bool isSmallScreen) {
    final buttonSize = isSmallScreen ? 60.0 : 70.0;
    final verticalSpacing = isSmallScreen ? 12.0 : 16.0;
    
    return Column(
      children: [
        // Première ligne: 1, 2, 3
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildKeypadButton('1', buttonSize, isSmallScreen),
            _buildKeypadButton('2', buttonSize, isSmallScreen),
            _buildKeypadButton('3', buttonSize, isSmallScreen),
          ],
        ),
        SizedBox(height: verticalSpacing),
        
        // Deuxième ligne: 4, 5, 6
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildKeypadButton('4', buttonSize, isSmallScreen),
            _buildKeypadButton('5', buttonSize, isSmallScreen),
            _buildKeypadButton('6', buttonSize, isSmallScreen),
          ],
        ),
        SizedBox(height: verticalSpacing),
        
        // Troisième ligne: 7, 8, 9
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildKeypadButton('7', buttonSize, isSmallScreen),
            _buildKeypadButton('8', buttonSize, isSmallScreen),
            _buildKeypadButton('9', buttonSize, isSmallScreen),
          ],
        ),
        SizedBox(height: verticalSpacing),
        
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildKeypadButton('0', buttonSize, isSmallScreen),
            _buildKeypadButton(
              '',
              buttonSize,
              isSmallScreen,
              icon: Icons.backspace_outlined,
              onTap: _handleBackspace,
            ),
          ],
        ),
      ],
    )
        .animate()
        .fadeIn(delay: 800.ms, duration: 600.ms)
        .slideY(begin: 0.3, end: 0);
  }

  Widget _buildKeypadButton(
    String number,
    double size,
    bool isSmallScreen, {
    IconData? icon,
    VoidCallback? onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap ?? () => _handleNumberPress(number),
        borderRadius: BorderRadius.circular(size / 2),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Theme.of(context).cardColor,
            border: Border.all(
              color: Theme.of(context).dividerColor.withValues(alpha: 0.2),
            ),
          ),
          child: Center(
            child: icon != null
                ? Icon(
                    icon,
                    size: isSmallScreen ? 20 : 24,
                    color: Theme.of(context).colorScheme.onSurface,
                  )
                : Text(
                    number,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      fontSize: isSmallScreen ? 18 : null,
                    ),
                  ),
          ),
        ),
      ),
    );
  }

  void _handleNumberPress(String number) {
    if (_isLoading) return;

    setState(() {
      if (_isConfirming) {
        if (_confirmPin.length < 4) {
          _confirmPin += number;
          if (_confirmPin.length == 4) {
            _validatePin();
          }
        }
      } else {
        if (_pin.length < 4) {
          _pin += number;
          if (_pin.length == 4) {
            _proceedToConfirmation();
          }
        }
      }
    });
  }

  void _handleBackspace() {
    if (_isLoading) return;

    setState(() {
      if (_isConfirming) {
        if (_confirmPin.isNotEmpty) {
          _confirmPin = _confirmPin.substring(0, _confirmPin.length - 1);
        }
      } else {
        if (_pin.isNotEmpty) {
          _pin = _pin.substring(0, _pin.length - 1);
        }
      }
    });
  }

  void _proceedToConfirmation() {
    Future.delayed(const Duration(milliseconds: 200), () {
      setState(() {
        _isConfirming = true;
      });
    });
  }

  Future<void> _validatePin() async {
    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    if (_pin == _confirmPin) {
      // Sauvegarde du PIN dans SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_pin', _pin);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Code PIN configuré avec succès'),
            backgroundColor: Colors.green,
          ),
        );
        context.go('/main');
      }
    } else {
      // PIN ne correspond pas
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Les codes PIN ne correspondent pas'),
            backgroundColor: Colors.red,
          ),
        );
        setState(() {
          _pin = '';
          _confirmPin = '';
          _isConfirming = false;
          _isLoading = false;
        });
      }
    }
  }
}