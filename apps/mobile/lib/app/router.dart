import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/app/injectable_config.dart';
import 'package:mobile/app/routes.dart';
import 'package:mobile/features/auth/cubit/auth_cubit.dart';
import 'package:mobile/features/auth/views/loading_page.dart';
import 'package:mobile/features/auth/views/login_page.dart';
import 'package:mobile/features/dashboard/views/dashboard_page.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: Routes.loading,
  routes: [
    GoRoute(
      path: Routes.login,
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: Routes.loading,
      builder: (context, state) => const LoadingPage(),
    ),
    GoRoute(
      path: Routes.dashboard,
      builder: (context, state) => const DashboardPage(),
    ),
  ],
  redirect: (context, state) async => await routerRedirect(context, state),
);

Future<String?> routerRedirect(
  BuildContext context,
  GoRouterState state,
) async {
  final fullPath = state.uri.toString();
  final authState = locator<AuthCubit>().state;

  switch (authState) {
    case Authenticated():
      if (unauthOnlyPaths.contains(fullPath)) {
        return Routes.dashboard;
      }
      return null;

    case Unauthenticated():
      if (authOnlyPaths.contains(fullPath)) {
        return Routes.login;
      }
      return null;

    case Loading():
      return Routes.loading;
  }
}

const authOnlyPaths = {Routes.dashboard, Routes.loading};

const unauthOnlyPaths = {Routes.login, Routes.loading};
