import type { SampleResponseData } from '@/stores/interface/response/sample';
import type { SampleResponseDataSerialize } from '@/stores/interface/responseSerialize/sample';

class SampleData {
  private sampleData;

  constructor({ sample_data: sampleData }: SampleResponseData) {
    this.sampleData = sampleData;
  }

  serialize(): SampleResponseDataSerialize {
    return {
      sampleData: this.sampleData,
    };
  }
}

export default SampleData;
