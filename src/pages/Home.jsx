import Layout from '../components/Layout';
import { sideimage } from '../assets';
import { landingpage } from '../assets';
import Header from '../components/Header';

const Home = () => {
    return (
        <>
            <Header hideSigninButton={false}/>
            <Layout >
                {/* <img src={landingpage} alt='product detail' width={570} height={530} className='object-contain' /> */}
            </Layout>
        </>
    );
};

export default Home;
