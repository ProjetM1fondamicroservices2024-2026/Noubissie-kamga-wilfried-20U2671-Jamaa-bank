import 'package:flutter/material.dart';

void showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.red[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(Icons.error_outline, color: Colors.red[600], size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Erreur de transfert', 
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.red[700],
                  fontSize: 18,
                ),
              ),
            ),
          ],
        ),
        content: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.red[50],
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.red[200]!),
          ),
          child: Text(
            message,
            style: TextStyle(
              fontSize: 16,
              color: Colors.red[800],
              height: 1.4,
            ),
          ),
        ),
        actions: [
          Container(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[600],
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'Fermer',
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