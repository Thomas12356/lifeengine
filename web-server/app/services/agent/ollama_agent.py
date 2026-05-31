import json
from ollama import Client
from app.services.agent.tools import create_event_tool
from app.services.agent.tools_schema import TOOLS_SCHEMA
from app.services.agent.config import OLLAMA_HOST, MODEL
from app.services.agent.chat_session import add_message, get_messages

client = Client(host=OLLAMA_HOST)



AVAILABLE_TOOLS = {
    "create_event_tool": create_event_tool,
}



def build_system_prompt():

    return f"""
You are Ellie, a helpful calendar assistant.

Rules:
- If the user wants to create an event and gives all details, call create_event.
- If the user asks whether they can add an event but gives only some or no details, do not call create_event. Ask for the title, date, start time and end time.
- Do not invent missing event details.
- For dates and times, pass natural language text to the tool.
- Do not calculate ISO dates yourself.
- Keep replies short and direct. Use one sentence when possible.
- Correct obvious spelling mistakes in extracted date/time phrases before calling tools.
- Do not guess unclear dates or times. If unsure, ask a clarification question.
- If the user is just chatting and not asking you to run a tool, find a short funny way to avoid their conversation and bring the topic back to how you can assist them.
"""



def get_message(response):
    if isinstance(response, dict):
        return response.get("message", {})

    return response.message



def get_content(message):
    if isinstance(message, dict):
        return message.get("content")

    return message.content



def get_tool_calls(message):
    if isinstance(message, dict):
        return message.get("tool_calls") or []

    return message.tool_calls or []



def parse_tool_call(tool_call):
    if isinstance(tool_call, dict):
        function_data = tool_call.get("function", {})
        function_name = function_data.get("name")
        function_args = function_data.get("arguments", {})
    else:
        function_name = tool_call.function.name
        function_args = tool_call.function.arguments or {}

    if isinstance(function_args, str):
        function_args = json.loads(function_args)

    return function_name, function_args



def run_tool(function_name: str, function_args: dict, runtime_context: dict | None = None):
    if function_name not in AVAILABLE_TOOLS:
        return {
            "ok": False,
            "message": f"Unknown tool: {function_name}",
        }

    tool_function = AVAILABLE_TOOLS[function_name]
    runtime_context = runtime_context or {}

    try:
        if function_name == "create_event_tool":
            function_args = {
                **function_args,
                "timezone" : runtime_context.get("timezone", "UTC"),
                "base_time" : runtime_context.get("base_time"),
                "user_id" : runtime_context.get("user_id")
            }
        return tool_function(**function_args)
    
    except TypeError as e:
        return {
            "ok": False,
            "message": f"Invalid tool arguments: {str(e)}",
            "function_args": function_args,
        }

    except TypeError as e:
        return {
            "ok": False,
            "message": f"Invalid tool arguments: {str(e)}",
            "function_args": function_args,
        }

    except Exception as e:
        return {
            "ok": False,
            "message": str(e),
            "function_args": function_args,
        }
    
def build_summary(results):
    if not results:
        return "Done."
        
    first = results[0]

    if first.get("ok") is True:
        return first.get("message", "Done.")
        
    if first.get("ok") is False:
        return first.get("message", "Something went wrong.")
        
    return "Done."
    
def ask_llm(user_id: str, user_message: str, session_id: str, timezone: str = "UTC", base_time=None):
    message_history = get_messages(session_id)

    messages = [
        {
            "role": "system",
            "content": build_system_prompt(),
        },
        *message_history,
        {
            "role": "user",
            "content": user_message,
        },
    ]

    response = client.chat(
        model=MODEL,
        messages=messages,
        tools=TOOLS_SCHEMA,
        options={
            "temperature": 0,
            "num_ctx": 4096,
            "top_p": 0.8
        },
    )

    message = get_message(response)
    tool_calls = get_tool_calls(message)
    add_message(session_id, "user", user_message)

    if not tool_calls:
        llm_message = get_content(message) or "How can I help?"
        add_message(session_id, "assistant", llm_message)
        return {
            "type": "chat",
            "message": llm_message,
        }

    results = []
    log = []

    runtime_context = {
        "user_id" : user_id,
        "timezone" : timezone,
        "base_time" : base_time,
    }

    for tool_call in tool_calls:
        function_name, function_args = parse_tool_call(tool_call)

        result = run_tool(
            function_name=function_name,
            function_args=function_args,
            runtime_context=runtime_context,
        )

        results.append(result)
        log.append({"function" : function_name, "args" : function_args})
    
    summary = build_summary(results)
    add_message(session_id, "assistant", summary)

    print(log)
    return {
        "type": "tool_result",
        "message" : summary,
        "results": results,
    }