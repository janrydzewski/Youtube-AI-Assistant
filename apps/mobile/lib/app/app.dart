import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/app/injectable_config.dart';
import 'package:mobile/app/router.dart';
import 'package:mobile/features/auth/cubit/auth_cubit.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      lazy: false,
      create: (_) => locator<AuthCubit>(),
      child: BlocListener<AuthCubit, AuthState>(
        listener: (context, state) => appRouter.refresh(),
        child: MaterialApp.router(
          debugShowCheckedModeBanner: false,
          routerConfig: appRouter,
          theme: ThemeData.dark(useMaterial3: true),
        ),
      ),
    );
  }
}
