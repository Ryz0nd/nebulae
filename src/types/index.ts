export interface CelestiaSamplingStats {
  jsonrpc: string;
  result: {
    head_of_sampled_chain: number;
    head_of_catchup: number;
    network_head_height: number;
    concurrency: number;
    catch_up_done: true;
    is_running: true;
  };
  id: 1;
}
