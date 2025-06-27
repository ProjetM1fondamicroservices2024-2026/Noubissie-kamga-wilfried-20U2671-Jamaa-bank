import 'package:flutter/material.dart';

Widget buildFinancialRow(String label, double amount, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: theme.textTheme.bodyLarge?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            '${amount.toStringAsFixed(0)} XAF',
            style: theme.textTheme.bodyLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.primaryColor,
            ),
          ),
        ],
      ),
    );
  }