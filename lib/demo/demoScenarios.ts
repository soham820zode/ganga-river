import { DemoScenario, DemoStep } from '../../types/demo';

const commonSteps = (anomalyScenarioId: string): DemoStep[] => [
  {
    id: 'orient',
    title: 'Orient',
    phase: 'ORIENT',
    description: 'System introduction and Digital Twin.',
    talkingPoint: 'Jal Pulse transforms complex environmental data into a single coherent view of the Ganga corridor.',
    route: '/'
  },
  {
    id: 'monitor',
    title: 'Monitor',
    phase: 'MONITOR',
    description: 'Live Monitoring dashboard.',
    talkingPoint: 'We continuously monitor simulated sensor streams across the network to establish a reliable baseline.',
    route: '/monitoring'
  },
  {
    id: 'analyze',
    title: 'Analyze',
    phase: 'ANALYZE',
    description: 'Historical Analytics view.',
    talkingPoint: 'By looking at recent historical trends, we contextualize current readings against known baselines.',
    route: '/analytics'
  },
  {
    id: 'forecast',
    title: 'Forecast',
    phase: 'FORECAST',
    description: '48-Hour Forecast projection.',
    talkingPoint: 'Our prototype forecast projects recent trends forward 48 hours to anticipate potential threshold crossings.',
    route: '/forecast'
  },
  {
    id: 'detect',
    title: 'Detect',
    phase: 'DETECT',
    description: 'Inject anomaly and trigger alert.',
    talkingPoint: 'The system has detected a simulated deviation. As the signal approaches the threshold, the intelligence layer evaluates its persistence.',
    route: '/intelligence' // Triggers anomaly on enter (handled by controller)
  },
  {
    id: 'notify',
    title: 'Notify',
    phase: 'NOTIFY',
    description: 'Simulate notification delivery.',
    talkingPoint: 'Once an alert is confirmed, a simulated notification is queued and delivered to the relevant response team.',
    route: '/alerts'
  },
  {
    id: 'respond',
    title: 'Respond',
    phase: 'RESPOND',
    description: 'Show response workflow in Alert Center.',
    talkingPoint: 'The alert center tracks the complete response lifecycle from detection through acknowledgment and active monitoring.',
    route: '/alerts'
  },
  {
    id: 'recover',
    title: 'Recover',
    phase: 'RECOVER',
    description: 'Simulate recovery and resolution.',
    talkingPoint: 'As conditions return to normal, the system detects recovery and resolves the incident.',
    route: '/monitoring' // Reset anomaly on enter (handled by controller)
  }
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'NORMAL',
    title: '01 Normal Conditions',
    description: 'Show a healthy baseline flow with stable trends and normal forecasts.',
    affectedStations: [],
    affectedParameters: [],
    expectedWorkflow: 'Baseline Monitoring',
    simulationType: 'NORMAL',
    steps: commonSteps('NORMAL').slice(0, 4) // Only up to Forecast
  },
  {
    id: 'BOD_INCREASE',
    title: '02 BOD Increase',
    description: 'A gradual increase in Biochemical Oxygen Demand triggering a workflow.',
    affectedStations: ['JLP-VAR-01'],
    affectedParameters: ['BOD', 'DO'],
    expectedWorkflow: 'Alert -> Notify -> Respond -> Recover',
    simulationType: 'BOD_SPIKE',
    steps: commonSteps('BOD_SPIKE')
  },
  {
    id: 'LOW_DO',
    title: '03 Low DO Event',
    description: 'Dissolved oxygen approaches and crosses lower reference.',
    affectedStations: ['JLP-KAN-01'],
    affectedParameters: ['DO'],
    expectedWorkflow: 'Alert -> Notify -> Respond -> Recover',
    simulationType: 'DO_DROP',
    steps: commonSteps('DO_DROP')
  },
  {
    id: 'TURBIDITY_EVENT',
    title: '04 Turbidity Event',
    description: 'Controlled turbidity spike demonstrating anomaly detection.',
    affectedStations: ['JLP-PAT-01'],
    affectedParameters: ['Turbidity'],
    expectedWorkflow: 'Detect Anomaly -> Alert -> Recover',
    simulationType: 'TURBIDITY_SPIKE',
    steps: commonSteps('TURBIDITY_SPIKE')
  },
  {
    id: 'PH_SHIFT',
    title: '05 pH Shift',
    description: 'pH moves outside configured reference range without extreme values.',
    affectedStations: ['JLP-VAR-01'],
    affectedParameters: ['pH'],
    expectedWorkflow: 'Alert -> Notify -> Recover',
    simulationType: 'NORMAL', // Assuming mapped to some normal modifier or a specific PH scenario if we had one. (We'll use BOD_SPIKE for now as placeholder for event triggering if PH not in sim type)
    steps: commonSteps('NORMAL')
  },
  {
    id: 'MULTI_STATION',
    title: '06 Multi-Station Event',
    description: 'Controlled event affecting multiple stations.',
    affectedStations: ['JLP-KAN-01', 'JLP-VAR-01'],
    affectedParameters: ['BOD', 'Turbidity'],
    expectedWorkflow: 'Network Summary Update -> Multiple Alerts',
    simulationType: 'MULTI_PARAMETER_EVENT',
    steps: commonSteps('MULTI_PARAMETER_EVENT')
  }
];
