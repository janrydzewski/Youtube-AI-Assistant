import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/widgets/app_background.dart';
import 'package:mobile/core/widgets/card_container.dart';
import 'package:mobile/features/auth/cubit/auth_cubit.dart';
import 'package:mobile/features/auth/widgets/login_button.dart';

class LoginPage extends HookWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthCubit>().state;

    useEffect(() {
      if (user != null) {
        Future.microtask(() => context.go('/dashboard'));
      }
      return null;
    }, [user]);

    return Scaffold(
      body: AppBackground(
        child: Center(
          child: CardContainer(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text(
                  'Sign in to continue',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 24),
                LoginButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
