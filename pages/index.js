import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('currentUser', currentUser);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

//server side
LandingPage.getInitialProps = async (context) => {
  const client = await buildClient(context);

  try {
    const { data } = await client.get('/api/users/currentuser');
    return data; // Ensure this is an object
  } catch (error) {
    console.error('Error fetching current user:', error);
    return {}; // Return an empty object in case of error
  }
};

export default LandingPage;
