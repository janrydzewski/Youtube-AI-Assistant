import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:injectable/injectable.dart';
import 'package:mobile/core/services/auth_service.dart';

part 'auth_state.dart';

@Singleton()
class AuthCubit extends Cubit<AuthState> {
  final AuthService _authService;
  late final StreamSubscription<GoogleSignInAccount?> _authSubscription;

  AuthCubit(this._authService) : super(Loading()) {
    _checkCurrentSession();
    _authSubscription = _authService.currentUser.listen((user) {
      if (user != null) {
        emit(Authenticated(user));
      } else {
        emit(Unauthenticated());
      }
    });
  }

  Future<void> signIn() async {
    emit(Loading());
    final user = await _authService.signInWithGoogle();
    emit(user != null ? Authenticated(user) : Unauthenticated());
  }

  Future<void> signOut() async {
    emit(Loading());
    await _authService.signOut();
    emit(Unauthenticated());
  }

  Future<void> _checkCurrentSession() async {
    final account = await _authService.getAccount();
    if (account != null) {
      emit(Authenticated(account));
    } else {
      emit(Unauthenticated());
    }
  }

  @override
  Future<void> close() {
    _authSubscription.cancel();
    return super.close();
  }
}
