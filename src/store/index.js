import { createStore } from 'vuex'


// firebase imports
import { auth } from '../firebase/config'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import axios from 'axios'


const store = createStore({
    state: {
        user: null,
        authIsReady: false,
        authToken: null,
        hokkus: []  // Add hokkus state
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
            console.log('user state changed:', state.user)
        },
        setAuthIsReady(state, payload) {
            state.authIsReady = payload
        },
        setAuthToken(state, token) {  // Define this mutation to handle authToken updates
            state.authToken = token;
            console.log('authToken updated:', token);
        },
        setHokkus(state, hokkus) {
            state.hokkus = hokkus
        },
        addHokku(state, hokku) {
            state.hokkus.push(hokku)
        },
        removeHokku(state, hokkuId) {
            state.hokkus = state.hokkus.filter(hokku => hokku.id !== hokkuId)
        },
        clearHokkus(state) {
            state.hokkus = []
        },
    },

    actions: {

        async signup(context, { email, password }) {
            console.log('signup action')

            const res = await createUserWithEmailAndPassword(auth, email, password)
            if (res) {
                context.commit('setUser', res.user)
                await context.dispatch('fetchAuthToken'); // Fetch token after signup
                await context.dispatch('makeApiRequest');
            } else {
                throw new Error('could not complete signup')
            }
        },

        async login(context, { email, password }) {
            console.log('login action')

            const res = await signInWithEmailAndPassword(auth, email, password)
            if (res) {
                context.commit('setUser', res.user)
                await context.dispatch('fetchAuthToken'); // Fetch token after login
            } else {
                throw new Error('could not complete login')
            }
        },

        async logout(context) {
            console.log('logout action')
            await signOut(auth)
            context.commit('setUser', null)
            context.commit('setAuthToken', null); // Clear token on logout
        },

        async fetchAuthToken(context) {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken(true);
                context.commit('setAuthToken', token);
                console.log('Token fetched and stored');
                
            }
        }, // Hokku actions
        async fetchHokkus(context) {
            if (context.state.authToken) {
                const response = await axios.get('/api/hokkus', {
                    headers: {
                        'Authorization': `Bearer ${context.state.authToken}`
                    }
                })
                context.commit('setHokkus', response.data)
            }
        },
        async addHokku(context, hokkuData) {
            if (context.state.authToken) {
                const response = await axios.post('/api/hokkus', hokkuData, {
                    headers: {
                        'Authorization': `Bearer ${context.state.authToken}`
                    }
                })
                context.commit('addHokku', response.data)
            }
        },
        async removeHokku(context, hokkuId) {
            if (context.state.authToken) {
                await axios.delete(`/api/hokkus/${hokkuId}`, {
                    headers: {
                        'Authorization': `Bearer ${context.state.authToken}`
                    }
                })
                context.commit('removeHokku', hokkuId)
            }
        },
        async clearHokkus(context) {
            if (context.state.authToken) {
                await axios.delete('/api/hokkus', {
                    headers: {
                        'Authorization': `Bearer ${context.state.authToken}`
                    }
                })
                context.commit('clearHokkus')
            }
        }
    }
});


// wait until auth is ready
const unsub = onAuthStateChanged(auth, (user) => {
    store.commit('setAuthIsReady', true)
    store.commit('setUser', user)
    if (user) {
        store.dispatch('fetchAuthToken');
    }
    unsub()
})


// export the store
export default store