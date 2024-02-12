const LandingPage = ({ currentUser }) => {
  console.log('currentUser', currentUser);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

//server side
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
