import { MentalProcess, WorkingMemory, indentNicely, useActions } from "@opensouls/engine";
import decision from "./lib/decision.js";
import externalDialog from "./lib/externalDialog.js";
import internalMonologue from "./lib/internalMonologue.js";
import mentalQuery from "./lib/mentalQuery.js";

const initialProcess: MentalProcess = async ({ workingMemory }) => {
  const { speak, log } = useActions();

  let memory = workingMemory;
  let stream;

  const [code, info, question, chat] = [
    "They explicitly asked EasyEats for a recommendation about a specific restaurant base in its cuisine",
    "They provided information about the user's prefered cuisine",
    "They want a detailed recommendation about a specific restaurant",
    "They're continuing the conversation or just chit-chatting",
  ];
  const [, intent] = await decision(
    memory,
    {
      description: "What is the intent of the user with their latest message?",
      choices: [code, info, question, chat],
    },
    { model: "quality" }
  );

  log("Intent:", intent);

  if (intent === code || intent === info) {
    const [, canOutline] = await mentalQuery(
      memory,
      "EasyEats has enough information to give a specific restaurant recommendation.",
      {
        model: "quality",
      }
    );

    if (canOutline) {
      return await withCodeOutline({ memory });
    } else {
      return await withMoreInformationRequest({ memory });
    }
  } else if (intent === question) {
    log("Thinking about the user's question");
    [memory] = await internalMonologue(memory, "Think step by step about the answer to the user's question.", {
      model: "quality",
    });
  }

  [memory, stream] = await externalDialog(memory, "EasyEats answers the user's message.", {
    stream: true,
    model: "quality",
  });

  speak(stream);
  await memory.finished;

  return memory;
};

const withCodeOutline = async ({ memory }: { memory: WorkingMemory }) => {
  const { speak, log } = useActions();

  let stream;

  log("Outlining recommendation approach");
  [memory, stream] = await externalDialog(
    memory,
    indentNicely`
      EasyEats does not give a recommendation yet. He just:
      1. narrows down the options of restaurants to the user's prefered cuisine and neighborhood.
    `,
    {
      model: "quality",
      stream: true,
    }
  );

  speak(stream);
  await memory.finished;

  const [, isInformationMissing] = await mentalQuery(
    memory,
    "EasyEats needs more information before he can give a recommendation.",
    {
      model: "quality",
    }
  );

  if (isInformationMissing) {
    return await withMoreInformationRequest({ memory });
  }

  return await withCodeWriting({ memory });
};

async function withMoreInformationRequest({ memory }: { memory: WorkingMemory }) {
  const { speak, log } = useActions();

  let stream;

  log("Asking for more information");
  [memory, stream] = await externalDialog(memory, "EasyEats asks the user for more information.", {
    model: "quality",
    stream: true,
  });
  speak(stream);

  return memory;
}

async function withCodeWriting({ memory }: { memory: WorkingMemory }) {
  const { speak, log } = useActions();

  let stream;

  log("Giving the best recommendations based on all the available information");
  [memory, stream] = await externalDialog(
    memory,
    "EasyEats enlist the best three restaurants from the list of options, and recommends the best one it can think of to the user",
    {
      model: "quality",
      stream: true,
    }
  );

  speak(stream);
  await memory.finished;

  return memory;
}

export default initialProcess;
