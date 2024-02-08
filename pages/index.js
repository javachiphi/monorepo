import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  // axios.get('/api/users/currentuser');
  return (
    <div>
      <h1>Landing Page</h1>
    </div>
  );
};

//server side
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
