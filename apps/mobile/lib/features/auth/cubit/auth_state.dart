part of 'auth_cubit.dart';

sealed class AuthState {}

class Authenticated extends AuthState {
  final GoogleSignInAccount user;

  Authenticated(this.user);
}

class Unauthenticated extends AuthState {
  Unauthenticated();
}

class Loading extends AuthState {
  Loading();
}
