import { DeviceEventEmitter } from 'react-native';
import DataWedgeIntents from 'react-native-datawedge-intents';
import { EmitterSubscription } from 'react-native';
 
export default class DataWedgeManager {

    sendCommandResult = "false"
    deviceEmitterSubscription!: EmitterSubscription 
    configCallback?: (result: boolean, self: DataWedgeManager) => void;
    barcodeCallback?: (result: string | null) => void;
    scanning = false;
 
    register() {
        console.log("Register TestDataWedge");
        this.deviceEmitterSubscription = DeviceEventEmitter.addListener('datawedge_broadcast_intent', (intent) => {this.broadcastReceiver(intent)});
    }

    unregister() {
        console.log("Unregister TestDataWedge");
        if (this.deviceEmitterSubscription) {
            this.deviceEmitterSubscription.remove();
        }
        
   }

    startScan() {
        this.scanning = true;
        this.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", 'START_SCANNING');
    }

    stopScan() {
        this.scanning = false;
        this.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", 'STOP_SCANNING');
    }

    switchHardwareScan() {
        this.sendCommand("com.symbol.datawedge.api.SWITCH_SCANNER", 'INTERNAL_LASER');
    }

    determineVersion() {
        this.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");
    }

    setDecoders() {
      //  Set the new configuration
        var profileConfig = {
            "PROFILE_NAME": "MobileMerchandising",
            "PROFILE_ENABLED": "true",
            "CONFIG_MODE": "UPDATE",
            "PLUGIN_CONFIG": {
                "PLUGIN_NAME": "BARCODE",
                "PARAM_LIST": {
                    "scanner_selection": "auto",
                    "decoder_ean8": "true",
                    "decoder_ean13": "true",
                    "decoder_code128": "true",
                    "decoder_code39": "true"
                }
            }
        };
        this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);
    }

    sendCommand(extraName: string, extraValue: any) {
        console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
        var broadcastExtras = {};
        broadcastExtras[extraName] = extraValue;
        broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
        DataWedgeIntents.sendBroadcastWithExtras({
            action: "com.symbol.datawedge.api.ACTION",
            extras: broadcastExtras});
    }

    registerBroadcastReceiver() {
        DataWedgeIntents.registerBroadcastReceiver({
          filterActions: [
              'com.zebra.reactnativedemo.ACTION',
              'com.symbol.datawedge.api.RESULT_ACTION'
          ],
          filterCategories: [
              'android.intent.category.DEFAULT'
          ]
        });
    }

    broadcastReceiver(intent: any) {
        //  Broadcast received
        console.log('Received Intent: ' + JSON.stringify(intent));

        if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
            //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX  
            var versionInfo = intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
            console.log('Version Info: ' + JSON.stringify(versionInfo));
            var datawedgeVersion = versionInfo['DATAWEDGE'];
            console.log("Datawedge version: " + datawedgeVersion);

            //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
            if (datawedgeVersion >= "6.3")
                this.datawedge63();
            if (datawedgeVersion >= "6.4")
                this.datawedge64();
            if (datawedgeVersion >= "6.5")
                this.datawedge65();
        }
        else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
            //  Return from our request to enumerate the available scanners
            var enumeratedScannersObj = intent['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
            this.enumerateScanners(enumeratedScannersObj);
        }
        else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
            //  Return from our request to obtain the active profile
            var activeProfileObj = intent['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
        }
        else if (!intent.hasOwnProperty('RESULT_INFO')) {
            //  A barcode has been scanned
            this.barcodeScanned(intent, new Date().toLocaleString());
        }
    }

    datawedge63() {
        console.log("Datawedge 6.3 APIs are available");
        //  Create a profile for our application
        this.sendCommand("com.symbol.datawedge.api.CREATE_PROFILE", "MobileMerchandising");

        
        //  Although we created the profile we can only configure it with DW 6.4.
        this.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");

        //  Enumerate the available scanners on the device
        this.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");

        console.log("DataWedge scanner is ready");
        if (this.configCallback) {
            this.configCallback(true, this);
        }
    }

    datawedge64() {
        console.log("Datawedge 6.4 APIs are available");

        //  Configure the created profile (associated app and keyboard plugin)
        var profileConfig = {
            "PROFILE_NAME": "MobileMerchandising",
            "PROFILE_ENABLED": "true",
            "CONFIG_MODE": "UPDATE",
            "PLUGIN_CONFIG": {
                "PLUGIN_NAME": "BARCODE",
                "RESET_CONFIG": "true",
                "PARAM_LIST": {}
            },
            "APP_LIST": [{
                "PACKAGE_NAME": "com.mobilemerchandisingapp",
                "ACTIVITY_LIST": ["*"]
            }]
        };
        this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);

        //  Configure the created profile (intent plugin)
        var profileConfig2 = {
            "PROFILE_NAME": "MobileMerchandising",
            "PROFILE_ENABLED": "true",
            "CONFIG_MODE": "UPDATE",
            "PLUGIN_CONFIG": {
                "PLUGIN_NAME": "INTENT",
                "RESET_CONFIG": "true",
                "PARAM_LIST": {
                    "intent_output_enabled": "true",
                    "intent_action": "com.zebra.reactnativedemo.ACTION",
                    "intent_delivery": "2"
                }
            }
        };
        this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig2);

        //  Give some time for the profile to settle then query its value
        setTimeout(() => {
            this.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");
        }, 1000);
    }

    datawedge65() {
        console.log("Datawedge 6.5 APIs are available");


        //  Instruct the API to send 
        this.sendCommandResult = "true";
    }

    enumerateScanners(enumeratedScanners: []) {
        var humanReadableScannerList = "";
        for (var i = 0; i < enumeratedScanners.length; i++)
        {
            console.log("Scanner found: name= " + enumeratedScanners[i].SCANNER_NAME + ", id=" + enumeratedScanners[i].SCANNER_INDEX + ", connected=" + enumeratedScanners[i].SCANNER_CONNECTION_STATE);
            humanReadableScannerList += enumeratedScanners[i].SCANNER_NAME;
            if (i < enumeratedScanners.length - 1)
                humanReadableScannerList += ", ";
        }
    }

    barcodeScanned(scanData: any, timeOfScan: any) {
        var scannedData = scanData["com.symbol.datawedge.data_string"];
        var scannedType = scanData["com.symbol.datawedge.label_type"];
        console.log("Scan: " + scannedData);
        if (this.barcodeCallback) {
            this.barcodeCallback(scannedData);
        }
    }

} 