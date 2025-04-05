import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/app/app.dart';
import 'package:mobile/app/injectable_config.dart';
import 'package:mobile/core/utils/bloc_observer.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  Bloc.observer = MyBlocObserver();

  configureDependencies();

  runApp(const MyApp());
}
