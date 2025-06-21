"use client";

import Image from "next/image";
import styles from "./page.module.css";
import * as near from "../near-rpc-client";

import { client } from "../near-rpc-client/client.gen";
import { health, tx } from "../near-rpc-client/sdk.gen";
import { HealthResponse, TxResponse } from "../near-rpc-client/types.gen";
import { useState } from "react";
import { createClient } from "@hey-api/client-fetch";

// configure internal service client
// client.setConfig({
//   // set default base url for requests
//   baseUrl: "https://archival-rpc.mainnet.near.org",
//   // set default headers for requests
//   // headers: {
//   //   Authorization: "Bearer <token_from_service_client>",
//   // },
// });

export default function Home() {
  const [healthResponse, setHealthResponse] = useState<HealthResponse>();

  const onFetchHealth = async () => {
    const { data: healthResponse } = await health({
      body: { id: "", jsonrpc: "2.0", method: "health", params: {} },
    });
    setHealthResponse(healthResponse);
  };

  const [txResponse, setTxResponse] = useState<TxResponse>();

  const onFetchTx = async () => {
    const client = createClient({
      baseUrl: "https://archival-rpc.mainnet.near.org",
    });
    const { data: txResponse } = await tx({
      client,
      body: {
        id: "",
        jsonrpc: "2.0",
        method: "tx",
        params: {
          sender_account_id: "frol.near",
          tx_hash: "3WA21kgFCX1tCEgaYnWNJnQYYmZ7WSuQDgvUa7cHDTYX",
        },
      },
    });
    if (txResponse && "result" in txResponse) {
      console.log(txResponse.result.final_execution_status);
    }
    setTxResponse(txResponse);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={onFetchHealth}>Health</button>
        <pre>{JSON.stringify(healthResponse)}</pre>
        <button onClick={onFetchTx}>
          TX status for 3WA21kgFCX1tCEgaYnWNJnQYYmZ7WSuQDgvUa7cHDTYX
        </button>
        <pre>{JSON.stringify(txResponse, null, 2)}</pre>
      </main>
    </div>
  );
}
