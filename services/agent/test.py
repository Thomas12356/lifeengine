from ollama_agent import ask_llm


def main():
    while True:
        user_message = input("User: ")
        result = ask_llm(user_message)
        print(result)


if __name__ == "__main__":
    main()