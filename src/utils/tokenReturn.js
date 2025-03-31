/* eslint-disable prettier/prettier */
async function tokenReturn() {
  let yourConfig = {
    headers: {
      Authorization:
        (await localStorage.getItem('token')) != null // Use AsyncStorage.getItem here
          ? 'Bearer ' + (await localStorage.getItem('token')) // Use AsyncStorage.getItem here
          : '',
    },
  };

  return yourConfig;
}

export default tokenReturn;
