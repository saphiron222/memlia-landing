# What are AI hallucinations?

AI hallucinations are incorrect or misleading results that [AI models](https://cloud.google.com/learn/what-is-artificial-intelligence) generate. These errors can be caused by a variety of factors, including insufficient training data, incorrect assumptions made by the model, or biases in the data used to train the model. AI hallucinations can be a problem for AI systems that are used to make important decisions, such as medical diagnoses or financial trading.

**New customers get up to $300 in free credits** to try Gemini Enterprise Agent Platform and other Google Cloud products.

Ground your AI [Ground your AI](https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview)

Learn about Agent Platform [Learn about Agent Platform](https://cloud.google.com/products/gemini-enterprise-agent-platform)

## How do AI hallucinations occur?

AI models are trained on data, and they [learn to make predictions](https://cloud.google.com/learn/what-is-machine-learning) by finding patterns in the data. However, the accuracy of these predictions often depends on the quality and completeness of the training data. If the training data is incomplete, biased, or otherwise flawed, the AI model may learn incorrect patterns, leading to inaccurate predictions or hallucinations.

For example, an AI model that is trained on a dataset of medical images may learn to identify cancer cells. However, if the dataset does not include any images of healthy tissue, the AI model may incorrectly predict that healthy tissue is cancerous.

Flawed training data is just one reason why AI hallucinations can occur. Another factor that may contribute is a lack of proper grounding. An AI model may struggle to accurately understand real-world knowledge, physical properties, or factual information. This lack of grounding can cause the model to generate outputs that, while seemingly plausible, are actually factually incorrect, irrelevant, or nonsensical. This can even extend to fabricating links to web pages that never existed.

An example of this would be an AI model designed to generate summaries of news articles may produce a summary that includes details not present in the original article, or even fabricates information entirely.

Understanding these potential causes of AI hallucinations is important for developers working with AI models. By carefully considering the quality and completeness of training data, as well as ensuring proper grounding, developers may minimize the risk of AI hallucinations and ensure the accuracy and reliability of their models.

## Examples of AI hallucinations

AI hallucinations can take many different forms. Some common examples include:

- **Incorrect predictions**: An AI model may predict that an event will occur when it is unlikely to happen. For example, an AI model that is used to predict the weather may predict that it will rain tomorrow when there is no rain in the forecast.
- **False positives**: When working with an AI model, it may identify something as being a threat when it is not. For example, an AI model that is used to detect fraud may flag a transaction as fraudulent when it is not.
- **False negatives**: An AI model may fail to identify something as being a threat when it is. For example, an AI model that is used to detect cancer may fail to identify a cancerous tumor.

## How to prevent AI hallucinations

### There are a number of things that can be done to help prevent AI hallucinations, including:

### Limit possible outcomes

When training an AI model, it is important to limit the number of possible outcomes that the model can predict. This can be done by using a technique called "regularization." Regularization penalizes the model for making predictions that are too extreme. This helps to prevent the model from overfitting the training data and making incorrect predictions.

### Train your AI with only relevant and specific sources

When training an AI model, it is important to use data that is relevant to the task that the model will be performing. For example, if you are training an AI model to identify cancer, you should use a dataset of medical images. Using data that is not relevant to the task can lead to the AI model making incorrect predictions.

### Create a template for your AI to follow

When training an AI model, it is helpful to create a template for the model to follow. This template can help to guide the model in making predictions. For example, if you are training an AI model to write text, you could create a template that includes the following elements:

- A title
- An introduction
- A body
- A conclusion

### Tell your AI what you want and don't want

When using an AI model, it is important to [tell the model](https://cloud.google.com/learn/what-is-natural-language-processing) what you want and don't want. This can be done by providing the model with feedback. For example, if you are using an AI model to generate text, you can provide the model with feedback by telling it which text you like and don't like. This will help the model to learn what you are looking for.

### Solve your business challenges with Google Cloud

New customers get $300 in free credits to spend on Google Cloud.

Get started [Get started](https://console.cloud.google.com/freetrial)

Talk to a Google Cloud sales specialist to discuss your unique challenge in more detail.

Contact us [Contact us](https://cloud.google.com/contact)

## Related Google Cloud products and services

- [![agent platform logo](https://www.gstatic.com/bricks/image/e5ea2372-3a1e-46fe-a0a2-a7c8b418b462.png)\\
\\
Gemini Enterprise Agent Platform\\
\\
Can help prevent AI hallucinations through data management and preparation for high-quality training data, comprehensive model evaluation to identify biases, and Explainable AI (XAI) to understand model reasoning and address hallucination causes.](https://cloud.google.com/products/gemini-enterprise-agent-platform)
- [![agent platform icon](https://www.gstatic.com/bricks/image/e5ea2372-3a1e-46fe-a0a2-a7c8b418b462.png)\\
\\
Agent Search\\
\\
Utilizes Retrieval-Augmented Generation (RAG) to ground models with data from your websites or documents indexed in Agent Search on Gemini Enterprise Agent Platform.](https://cloud.google.com/products/gemini-enterprise-agent-platform/agent-search)

#### How Google Cloud can help prevent hallucinations

Learn how to use Google Cloud to help prevent AI hallucinations:

- [How to use Grounding for your LLMs with text embeddings](https://cloud.google.com/blog/products/ai-machine-learning/how-to-use-grounding-for-your-llms-with-text-embeddings)
- [Generative AI applications with Vertex AI PaLM 2 Models and LangChain](https://cloud.google.com/blog/products/ai-machine-learning/generative-ai-applications-with-vertex-ai-palm-2-models-and-langchain)
- [Grounding Overview](https://cloud.google.com/vertex-ai/docs/generative-ai/grounding/overview)

#### Take the next step

Start building on Google Cloud with $300 in free credits and 20+ always free products.

Get started for free [Get started for free](https://console.cloud.google.com/freetrial/)

- ##### Need help getting started?

[Contact sales](https://cloud.google.com/contact/)
- ##### Work with a trusted partner

[Find a partner](https://cloud.google.com/find-a-partner/)
- ##### Continue browsing

[See all products](https://cloud.google.com/products/)