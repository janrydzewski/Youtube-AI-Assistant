import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final _googleSignIn = GoogleSignIn(
    scopes: [
      'email',
      'https://www.googleapis.com/auth/youtube.force-ssl',
    ],
  );

  Future<GoogleSignInAccount?> signInWithGoogle() async {
    try {
      final account = await _googleSignIn.signIn();
      return account;
    } catch (_) {
      return null;
    }
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
  }

  Future<String?> getAccessToken() async {
    final account = _googleSignIn.currentUser ?? await _googleSignIn.signInSilently();
    final auth = await account?.authentication;
    return auth?.accessToken;
  }

  Future<String?> getIdToken() async {
    final account = _googleSignIn.currentUser ?? await _googleSignIn.signInSilently();
    final auth = await account?.authentication;
    return auth?.idToken;
  }

  GoogleSignInAccount? get currentUser => _googleSignIn.currentUser;
}
