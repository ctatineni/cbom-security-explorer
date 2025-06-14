
import { Application, Service, CBOMData } from '@/data/mockCBOMData';
import { CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';

export interface DataSource {
  type: 'single' | 'multiple' | 'github';
  format: string;
  lastUpdated: string;
  serviceCount: number;
  status: 'active' | 'processing' | 'error';
}

export interface ComponentsDrillDownData {
  query: string;
  componentType: 'libraries' | 'languages';
  components: any[];
  totalApplications: number;
  totalServices: number;
}

export interface CBOMViewerState {
  searchMode: 'cbom' | 'crypto-materials';
  cbomData: CBOMData | null;
  cryptoMaterialsData: CryptoMaterialsData | null;
  selectedApplication: Application | null;
  selectedNode: any;
  selectedService: Service | null;
  loading: boolean;
  showServiceDetails: boolean;
  activeTab: string;
  componentsDrillDownData: ComponentsDrillDownData | null;
  lastSearchQuery: string;
  dataSources: DataSource[];
  selectedDataSource: DataSource;
}
