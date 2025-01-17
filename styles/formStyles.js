import { StyleSheet } from 'react-native';

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    color: "#4A55A2",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
    color: "#6c6c6c",
    textAlign: 'center',
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A55A2",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    width: '90%',
    color: '#333',
  },
  button: {
    borderRadius: 25,
    width: "100%",
    backgroundColor: "#4A55A2",
    padding: 15,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    color: "#4A55A2",
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default formStyles;


export const inputContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 15,
  };
  
  export const icon = {
    marginRight: 10,
  };
  
  export const input = {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'black',
  };
