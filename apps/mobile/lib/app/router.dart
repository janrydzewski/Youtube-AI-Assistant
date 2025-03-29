import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/auth/cubit/auth_cubit.dart';
import 'package:mobile/features/auth/views/login_page.dart';
import 'package:mobile/features/dashboard/views/dashboard_page.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardPage(),
      redirect: (context, state) {
        final authCubit = context.read<AuthCubit>();
        final user = authCubit.state;
        if (user == null) {
          return '/';
        }
        return null;
      },
    ),
  ],
);
