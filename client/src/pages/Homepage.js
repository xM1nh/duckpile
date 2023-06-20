import MainNavBar from '../components/navbar/MainNavbar'
import SummaryContainer from '../components/container/SummaryContainer'
import './_Homepage.css'

const Homepage = () => {
    return (
        <div className='page home'>
            <MainNavBar />
            <main>
                <section className='summary'>
                    <SummaryContainer data_to_show='69' text_to_show='test Text 1' isLoading={false} serverErr={null}/>
                    <SummaryContainer data_to_show='420' text_to_show='test Text 2' isLoading={false} serverErr={null}/>
                    <SummaryContainer data_to_show='42069' text_to_show='test Text 3' isLoading={false} serverErr={null}/>
                    <SummaryContainer data_to_show='6942420' text_to_show='test Text 4' isLoading={false} serverErr={null}/>
                </section>
                <section className='on-show'></section>
                <section className='micellaneous'></section>
            </main>
        </div>
    )
}

export default Homepage