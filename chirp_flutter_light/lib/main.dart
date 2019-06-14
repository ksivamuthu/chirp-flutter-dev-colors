import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:simple_permissions/simple_permissions.dart';
import 'package:chirpsdk/chirpsdk.dart';

import 'lightcolorinfo.dart';

void main() => runApp(MyApp());

String _appKey = '<Chirp_App_Key>';
String _appSecret = '<Chirp_App_Secret>';
String _appConfig = '<Chirp_App_Config>';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.purple,
      ),
      home: MyHomePage(title: 'Dev Colors'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with WidgetsBindingObserver {
  final List<LightColorInfo> _colorInfos = <LightColorInfo>[
    LightColorInfo(
        "Angular", "Red", Colors.white, Color(0xFFB52E31), Color(0xFFB52E31)),
    LightColorInfo(
        "React", "Blue", Colors.white, Color(0xFF00D8FF), Color(0xFF00D8FF)),
    LightColorInfo(
        "Vue", "Green", Colors.white, Color(0xFF42B883), Color(0xFF42B883)),
    LightColorInfo(
        "Chirp", "Yellow", Colors.blue, Color(0xFFFFCF4F), Color(0xFFFFCF4F))
  ];

  Future<void> _initChirp() async {
    await ChirpSDK.init(_appKey, _appSecret);
  }

  Future<void> _configureChirp() async {
    await ChirpSDK.setConfig(_appConfig);
  }

  Future<void> _startAudioProcessing() async {
    await ChirpSDK.start();
  }

  Future<void> _stopAudioProcessing() async {
    await ChirpSDK.stop();
  }

  Future<void> _requestPermissions() async {
    bool permission =
        await SimplePermissions.checkPermission(Permission.RecordAudio);
    if (!permission) {
      await SimplePermissions.requestPermission(Permission.RecordAudio);
    }
  }

  @override
  void initState() {
    super.initState();
    _requestPermissions();
    _initChirp();
    _configureChirp();
    _startAudioProcessing();
  }

  @override
  void dispose() {
    _stopAudioProcessing();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      _stopAudioProcessing();
    } else if (state == AppLifecycleState.resumed) {
      _startAudioProcessing();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Container(
        child: Padding(
          padding: EdgeInsets.all(10),
          child: ListView.builder(
            itemCount: _colorInfos.length,
            itemBuilder: (context, i) {
              return _buildRow(_colorInfos[i]);
            },
          ),
        ),
      ),
    );
  }

  Widget _buildRow(LightColorInfo info) {
    return GestureDetector(
      onTap: () async {
        String identifier = '#${info.lightColor.value.toRadixString(16)}';
        var payload = new Uint8List.fromList(identifier.codeUnits);
        await ChirpSDK.send(payload);
      },
      child: Card(
        elevation: 5.0,
        child: Padding(
          padding:
              EdgeInsets.only(left: 5.0, right: 5.0, top: 10.0, bottom: 10.0),
          child: ListTile(
              leading: Container(
                width: 50.0,
                height: 50.0,
                decoration: BoxDecoration(
                  color: info.lightColor,
                  borderRadius: BorderRadius.circular(50.0),
                  boxShadow: [
                    BoxShadow(blurRadius: 2.0, offset: Offset(1.0, 1.0))
                  ],
                ),
              ),
              title: Text(
                info.title,
                style: TextStyle(
                  fontSize: 24,
                ),
              ),
              subtitle: Text(
                info.subtitle,
                style: TextStyle(fontSize: 20),
              )),
        ),
      ),
    );
  }
}
