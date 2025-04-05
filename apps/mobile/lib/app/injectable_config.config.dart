// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:mobile/core/services/auth_service.dart' as _i620;
import 'package:mobile/features/auth/cubit/auth_cubit.dart' as _i450;

extension GetItInjectableX on _i174.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    gh.singleton<_i620.AuthService>(() => _i620.AuthService());
    gh.singleton<_i450.AuthCubit>(
        () => _i450.AuthCubit(gh<_i620.AuthService>()));
    return this;
  }
}
