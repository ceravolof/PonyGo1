<template>
  <div class="auth-container">
    <h2>Registrazione</h2>
    <form @submit.prevent="registerUser">
      <input v-model="registerData.userid" type="text" placeholder="Username" required />
      <input v-model="registerData.email" type="email" placeholder="Email" required />
      <input v-model="registerData.passwd" type="password" placeholder="Password" required />
      <input v-model="registerData.type" type="text" placeholder="Tipo utente (es: admin, user)" required />
      <button type="submit">Registrati</button>
    </form>

    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <input v-model="loginData.email" type="email" placeholder="Email" required />
      <input v-model="loginData.passwd" type="password" placeholder="Password" required />
      <button type="submit">Accedi</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerData: {
        userid: '',
        email: '',
        passwd: '',
        type: ''
      },
      loginData: {
        email: '',
        passwd: ''
      }
    };
  },
  methods: {
    registerUser() {
      // Invio richiesta di registrazione
      fetch('/utenti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.registerData)
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
        })
        .catch(error => {
          console.error('Errore nella registrazione:', error);
        });
    },
    loginUser() {
      // Invio richiesta di login
      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loginData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Autenticazione avvenuta con successo') {
            alert('Benvenuto, ' + data.user.userid);
          } else {
            alert(data.message);
          }
        })
        .catch(error => {
          console.error('Errore nel login:', error);
        });
    }
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
button {
  padding: 10px;
  width: 100%;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>
