from services.agent.old_agent import *

if __name__ == "__main__":
    print("Agent test")

    while True:
        user_input = input("Enter Message: ")

        try:
            result = handle_message_from_user(user_input)
            print(result)
        except Exception as e:
            print("Error: ", e)
