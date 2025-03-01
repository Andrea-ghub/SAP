# S.A.P. - Scuola Aria Pulita

**Monitoraggio della Concentrazione di CO2 nelle Aule Scolastiche.**


Il progetto SAP, **finanziato da Assoprovider**, ha lo scopo principale di dimostrare come le tecnologie LoraWan e Blockchain possono offrire nuove opportunità di business ai propri associati.
Abbiamo scelto di sviluppare questo tipo di soluzione perchè risponde a una problematica concreta, ovvero l'impatto negativo che la concentrazione elevata di CO2 nelle aule scolastiche ha sulla capacità di apprendimento e attenzione degli studenti e del personale docente. Una ricerca del SIMA , ha evidenziato l’importanza della misurazione dei parametri ambientali .


# Descrizione della applicazione:

La soluzione proposta consiste nell'utilizzo di sensori che misurano la concentrazione di CO2, la temperatura e l'umidità per garantire livelli accettabili in aula. I dati rilevati vengono registrati su una piattaforma basata su LoraWan e sulla blockchain Algorand, dove sono conservati in modo sicuro e immutabile.
Un software di lettura consente la visualizzazione in tempo reale dei dati su una dashboard, fornendo una facile comprensione delle informazioni e la possibilità di prendere decisioni tempestive. Il software è sviluppato con strumenti open source e quindi facilmente replicabile.
SAP rappresenta solo un esempio delle molte possibilità offerte dalle tecnologie LoraWan e Blockchain.




**Software utilizzato:**

* Server LoraWan Chirpstark https://www.chirpstack.io/
* Algorand non-relay Node https://developer.algorand.org/


**Requisiti**
* Installare node.js e npm


**Come usare l'applicazione**

* Clonate il reposity con il comando  git clone https://github.com/algowifi/SAP
* Modificate il file schools.json con i dati delle vostre scuole
  
* per eseguire l'applicazione lanciate il comando: **node server.js**
