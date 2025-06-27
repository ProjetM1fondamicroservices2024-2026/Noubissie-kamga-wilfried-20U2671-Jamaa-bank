// utils/mockAccountRequests.js - Données mockées pour les demandes de compte

export const mockAccountRequests = [
  {
    id: 'REQ001',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'ndeuna.sinclair@email.com',
    phone: '+33 6 12 34 56 78',
    status: 'pending',
    submittedAt: '2024-06-18T10:30:00Z',
    cniNumber: '123456789012',
    cniRecto: 'https://randomuser.me/api/portraits/men/1.jpg',
    cniVerso: 'https://randomuser.me/api/portraits/men/2.jpg',
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'REQ002',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.com',
    phone: '+33 6 98 76 54 32',
    status: 'approved',
    submittedAt: '2024-06-17T14:20:00Z',
    cniNumber: '987654321098',
    cniRecto: 'https://randomuser.me/api/portraits/women/1.jpg',
    cniVerso: 'https://randomuser.me/api/portraits/women/2.jpg',
    reviewedBy: 'Admin Principal',
    reviewedAt: '2024-06-18T09:15:00Z',
  },
  {
    id: 'REQ003',
    firstName: 'Pierre',
    lastName: 'Dubois',
    email: 'pierre.dubois@entreprise.com',
    phone: '+33 6 55 44 33 22',
    status: 'rejected',
    submittedAt: '2024-06-16T16:45:00Z',
    cniNumber: null,
    cniRecto: null,
    cniVerso: null,
    reviewedBy: 'Admin Secondaire',
    reviewedAt: '2024-06-17T10:00:00Z',
  },
  {
    id: 'REQ004',
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 11 22 33 44',
    status: 'pending',
    submittedAt: '2024-06-15T09:10:00Z',
    cniNumber: '112233445566',
    cniRecto: 'https://randomuser.me/api/portraits/women/3.jpg',
    cniVerso: null,
    reviewedBy: null,
    reviewedAt: null,
  },
];

// Statistiques calculées automatiquement
export const getAccountRequestsStats = () => {
  return {
    total: mockAccountRequests.length,
    pending: mockAccountRequests.filter(r => r.status === 'pending').length,
    underReview: mockAccountRequests.filter(r => r.status === 'under_review').length,
    approved: mockAccountRequests.filter(r => r.status === 'approved').length,
    rejected: mockAccountRequests.filter(r => r.status === 'rejected').length,
    highRisk: mockAccountRequests.filter(r => r.riskLevel === 'high').length,
    byAccountType: {
      checking: mockAccountRequests.filter(r => r.accountType === 'checking').length,
      savings: mockAccountRequests.filter(r => r.accountType === 'savings').length,
      business: mockAccountRequests.filter(r => r.accountType === 'business').length
    }
  };
};

export default mockAccountRequests;