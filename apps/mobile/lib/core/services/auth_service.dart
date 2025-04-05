import 'package:google_sign_in/google_sign_in.dart';
import 'package:injectable/injectable.dart';

@Singleton()
class AuthService {
  final _googleSignIn = GoogleSignIn(
    scopes: [
      'email',
      'https://www.googleapis.com/auth/youtube.force-ssl',
    ],
  );

  Stream<GoogleSignInAccount?> get currentUser =>
      _googleSignIn.onCurrentUserChanged;

  Future<GoogleSignInAccount?> signInWithGoogle() async {
    try {
      return await _googleSignIn.signIn();
    } catch (_) {
      return null;
    }
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
  }

  Future<GoogleSignInAccount?> getAccount() async {
    return _googleSignIn.currentUser ?? await _googleSignIn.signInSilently();
  }

  Future<String?> getAccessToken() async {
    final account = await getAccount();
    final auth = await account?.authentication;
    return auth?.accessToken;
  }

  Future<String?> getIdToken() async {
    final account = await getAccount();
    final auth = await account?.authentication;
    return auth?.idToken;
  }
}
