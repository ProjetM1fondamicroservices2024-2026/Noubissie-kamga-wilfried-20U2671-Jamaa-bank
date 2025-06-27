
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

Widget buildPinSection(ThemeData theme, TextEditingController _pinController) {
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
                Icon(Icons.security, color: theme.primaryColor, size: 24),
                const SizedBox(width: 12),
                Text(
                  'Authentification sécurisée',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.primaryColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            TextField(
              controller: _pinController,
              obscureText: true,
              keyboardType: TextInputType.number,
              maxLength: 4,
              decoration: InputDecoration(
                labelText: 'Code PIN',
                hintText: 'Saisissez votre code PIN à 4 chiffres',
                prefixIcon: Icon(Icons.lock_outline, color: theme.primaryColor),
                counterText: '',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: theme.primaryColor.withValues(alpha: 0.3)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: theme.primaryColor, width: 2),
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    size: 20,
                    color: Colors.blue[700],
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Votre code PIN est requis pour sécuriser cette transaction',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.blue[700],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: 800.ms, duration: 600.ms)
        .slideY(begin: 0.3, end: 0);
  }