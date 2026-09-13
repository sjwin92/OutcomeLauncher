import { PageHeader } from '../components/ui'
import { useStore } from '../data/store'
import { OrderTable } from './BuyerDashboard'

export function Orders() {
  const { currentUser } = useStore()
  const seller = currentUser?.role === 'seller'
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Orders"
        title={seller ? 'Incoming outcome orders' : 'Your purchases'}
        description={
          seller
            ? 'Run the agent workflow, review proof, then mark completed, request a manual fix, or flag a dispute.'
            : 'Follow intake, logs, and proof. After completion you can leave a rating.'
        }
      />
      <OrderTable buyerView={!seller} />
    </div>
  )
}
