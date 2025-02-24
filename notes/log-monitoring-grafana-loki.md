# Logging and monitoring a **React Native Expo app** using **Grafana, Loki, and Prometheus** involves setting up **client-side logging**, forwarding logs to a **centralized logging system**, and visualizing them in **Grafana**.

---

## **🚀 Steps to Set Up Logging & Monitoring for an Expo App**

### **1️⃣ Install Required Dependencies**

You'll need a logging library for React Native to collect logs.

```sh
npm install @react-native-async-storage/async-storage axios winston
```

Alternatively, you can use `expo-application` and `expo-device` to fetch device information.

```sh
expo install expo-application expo-device
```

---

### **2️⃣ Configure Logging in Your Expo App**

Create a **logger utility** that captures logs and sends them to a backend that pushes logs to Loki.

#### **📌 logger.ts**

```tsx
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Loki Push API URL
const LOKI_ENDPOINT = 'http://YOUR-LOKI-SERVER/loki/api/v1/push';

// Function to get device information
const getDeviceInfo = async () => {
  const deviceId = await AsyncStorage.getItem('deviceId');
  return deviceId || 'unknown_device';
};

// Function to send logs to Loki
const sendLogToLoki = async (level: string, message: string, metadata?: any) => {
  try {
    const deviceId = await getDeviceInfo();
    const logData = {
      streams: [
        {
          labels: `{app="expo-app", device="${deviceId}", platform="${Platform.OS}"}`,
          entries: [
            {
              ts: new Date().toISOString(),
              line: JSON.stringify({ level, message, metadata }),
            },
          ],
        },
      ],
    };

    await axios.post(LOKI_ENDPOINT, logData);
  } catch (error) {
    console.error('Failed to send log to Loki:', error);
  }
};

// Logging methods
const Logger = {
  info: (msg: string, meta?: any) => sendLogToLoki('info', msg, meta),
  warn: (msg: string, meta?: any) => sendLogToLoki('warn', msg, meta),
  error: (msg: string, meta?: any) => sendLogToLoki('error', msg, meta),
};

export default Logger;
```

---

### **3️⃣ Use the Logger in Your App**

Call the logger inside your components or error handling logic.

#### **📌 Example Usage in a Component**

```tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Logger from './logger';

const HomeScreen = () => {
  useEffect(() => {
    Logger.info('App Started', { screen: 'HomeScreen' });
  }, []);

  const handleError = () => {
    try {
      throw new Error('Something went wrong!');
    } catch (error) {
      Logger.error('Unhandled error occurred', { error: error.message });
    }
  };

  return (
    <View>
      <Text>Welcome to Expo App</Text>
      <Button title="Trigger Error" onPress={handleError} />
    </View>
  );
};

export default HomeScreen;
```

---

## **🔧 4️⃣ Set Up Loki and Prometheus on Your Backend**

You'll need a backend that collects logs and pushes them to **Loki**.

### **Docker Compose Setup (Loki, Prometheus, Grafana)**

Create a `docker-compose.yml` file.

```yaml
version: '3.7'

services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  grafana-data:
```

---

## **📊 5️⃣ Set Up Grafana to Visualize Logs**

1. **Run Docker Compose**:

   ```sh
   docker-compose up -d
   ```

2. **Open Grafana** at `http://localhost:3000/`
3. **Add a Data Source**:
   - Go to **Configuration → Data Sources**
   - Choose **Loki**
   - Set URL to `http://loki:3100`
4. **Create a Dashboard**:
   - Use **Explore** to query `{app="expo-app"}`
   - Build visualizations for logs

---

## **🎯 Summary**

✅ **Expo App Logs** → Sent to **Loki API**  
✅ **Loki Stores Logs** → Monitored by **Prometheus**  
✅ **Grafana** → Used to visualize logs  

---

## **🚀 Bonus: Alerting with Prometheus & Grafana**

You can configure **Prometheus AlertManager** to send alerts (Slack, Email, etc.) when critical logs (e.g., errors) occur.

Would you like help setting up **alerts**? 🚨
