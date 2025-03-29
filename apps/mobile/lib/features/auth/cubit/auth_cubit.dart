import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile/core/services/auth_service.dart';

class AuthCubit extends Cubit<GoogleSignInAccount?> {
  final AuthService _authService;

  AuthCubit(this._authService) : super(null);

  Future<void> signIn() async {
    final user = await _authService.signInWithGoogle();
    emit(user);
  }

  Future<void> signOut() async {
    await _authService.signOut();
    emit(null);
  }
}
