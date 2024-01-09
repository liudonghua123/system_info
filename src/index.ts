import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QTextEdit, QGridLayout } from '@nodegui/nodegui';
import logo from '../assets/logox200.png';

import si from 'systeminformation';

async function getSystemInfo() {
  try {
    const systemBrand = await si.system();
    const osInfo = await si.osInfo();
    const diskSerial = await si.diskLayout();
    let networkInterfaces = await si.networkInterfaces();
    if (!Array.isArray(networkInterfaces)) {
      networkInterfaces = [networkInterfaces];
    }
    const common_separator = ', ';
    const common_not_available = 'N/A';
    const systemInfo = {
      brand: systemBrand.manufacturer,
      model: systemBrand.model,
      os: osInfo.distro,
      diskSerial: diskSerial.length > 0 ? diskSerial.map(item => item.serialNum).join(common_separator) : common_not_available,
      mac: networkInterfaces.length > 0 ? networkInterfaces.filter(item => item.mac).map(item => item.mac).join(common_separator) : common_not_available,
      ip: networkInterfaces.length > 0 ? networkInterfaces.filter(item => item.ip4 && item.ip4 !== '127.0.0.1').map(item => item.ip4).join(common_separator) : common_not_available,
      installdate: osInfo.installdate,
    };
    return systemInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

(async () => {

  // get systemInfo 
  const systemInfo = await getSystemInfo();

  if(!systemInfo) {
    process.exit(-1);
  }

  const win = new QMainWindow();
  win.setWindowTitle("SystemInfo");

  const centralWidget = new QWidget();
  centralWidget.setObjectName("myroot");
  const rootLayout = new QGridLayout();
  centralWidget.setLayout(rootLayout);

  // Brand
  const labelBrand = new QLabel();
  labelBrand.setObjectName("Brand");
  labelBrand.setText("品牌");
  const inputBrand = new QTextEdit();
  inputBrand.setText(systemInfo.brand);

  // Model
  const labelModel = new QLabel();
  labelModel.setObjectName("Model");
  labelModel.setText("型号");
  const inputModel = new QTextEdit();
  inputModel.setText(systemInfo.model);

  // OS
  const labelOS = new QLabel();
  labelOS.setObjectName("OS");
  labelOS.setText("操作系统");
  const inputOS = new QTextEdit();
  inputOS.setText(systemInfo.os);

  // DiskSerial
  const labelDiskSerial = new QLabel();
  labelDiskSerial.setObjectName("DiskSerial");
  labelDiskSerial.setText("磁盘序列号");
  const inputDiskSerial = new QTextEdit();
  inputDiskSerial.setText(systemInfo.diskSerial);

  // MAC
  const labelMAC = new QLabel();
  labelMAC.setObjectName("MAC");
  labelMAC.setText("MAC地址");
  const inputMAC = new QTextEdit();
  inputMAC.setText(systemInfo.mac);

  // IP
  const labelIP = new QLabel();
  labelIP.setObjectName("IP");
  labelIP.setText("IP地址");
  const inputIP = new QTextEdit();
  inputIP.setText(systemInfo.ip);

  // Installdate
  const labelInstalldate = new QLabel();
  labelInstalldate.setObjectName("Installdate");
  labelInstalldate.setText("系统安装时间");
  const inputInstalldate = new QTextEdit();
  inputInstalldate.setText(systemInfo.installdate);

  rootLayout.addWidget(labelBrand, 0, 0);
  rootLayout.addWidget(inputBrand, 0, 1);

  rootLayout.addWidget(labelModel, 1, 0);
  rootLayout.addWidget(inputModel, 1, 1);

  rootLayout.addWidget(labelOS, 2, 0);
  rootLayout.addWidget(inputOS, 2, 1);

  rootLayout.addWidget(labelDiskSerial, 3, 0);
  rootLayout.addWidget(inputDiskSerial, 3, 1);

  rootLayout.addWidget(labelMAC, 4, 0);
  rootLayout.addWidget(inputMAC, 4, 1);

  rootLayout.addWidget(labelIP, 5, 0);
  rootLayout.addWidget(inputIP, 5, 1);

  rootLayout.addWidget(labelInstalldate, 6, 0);
  rootLayout.addWidget(inputInstalldate, 6, 1);

  win.setCentralWidget(centralWidget);
  win.setStyleSheet(
    `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
  );
  win.show();

  (global as any).win = win;

})();
