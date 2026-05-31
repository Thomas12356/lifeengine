from ollama_agent import ask_llm

SESSION_ID = "terminal_user"

def main():
    while True:
        user_message = input("User: ")
        result = ask_llm(user_message, SESSION_ID)
        print(result)


if __name__ == "__main__":
    main()