import './_InventoryPage.css'
import MainNavbar from '../components/navbar/MainNavbar'
import SummaryContainner from '../components/container/SummaryContainer'
import Spinner from '../components/spinner/Spinner'
import Table from '../components/container/Table'

const InventoryPage = () => {
    return (
        <div className='page inventory'>
            <MainNavbar />
            
            <main>
                <div className='inventory-summary'>
                    <SummaryContainner />
                    <SummaryContainner />
                    <SummaryContainner />
                </div>
                <div className='inventory-detail'>
                    <div>
                        <Table header_array={['table 1', 'table 1']} data_array={[]} />
                    </div>
                    <div>
                        <Table header_array={['table 2', 'table 2']} data_array={[]} />
                    </div>
                    <div>
                    <Table header_array={['table 3', 'table 3']} data_array={[]} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default InventoryPage