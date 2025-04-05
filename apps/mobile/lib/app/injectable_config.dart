import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:mobile/app/injectable_config.config.dart';

final GetIt locator = GetIt.instance;

@InjectableInit()
void configureDependencies() => locator.init();
