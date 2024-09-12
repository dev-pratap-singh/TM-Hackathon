import json
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
import fasttext
import re
from gensim.parsing.preprocessing import remove_stopwords
from sklearn.cluster import DBSCAN
import fasttext
import pandas as pd
import math
from sklearn.cluster import KMeans
import os
from langchain.chains import ConversationalRetrievalChain
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from io import BytesIO

def round_up_to_hundreds(number):
    rounded_number = math.ceil(number / 100) * 100
    return rounded_number


def find_and_round_number(input_string):
    match = re.search(r'\(\d+\s+[cc]+\)', input_string)
    match = re.search(r'\d+', match.group())
    if match:
        number = int(match.group())
        result = round_up_to_hundreds(number)
        output_string = input_string.replace(match.group(), f"{result}")

        return output_string
    else:
        return input_string


@api_view(['GET'])
def hello_world(request):
    return Response({"data": "Hello World"})


def remove_special_characters_and_stopwords(words):
    return remove_stopwords(re.sub(r"[^a-zA-Z0-9 ]", "", words))


def get_unique_words(words):
    words_dict = {}
    for w in words.split(" "):
        words_dict[w] = 0
    return words_dict


def get_word_vector(model, word):
    word = remove_special_characters_and_stopwords(word)
    # print(word)
    word = get_unique_words(word)
    # print(word)
    word_vect = []
    for w in word:
        word_vect.append(model.get_word_vector(w))
    word_vect = np.array(word_vect)
    # print(word_vect - word_vect.mean(axis=0))
    return word_vect.mean(axis=0)


def get_sentence_vector(ft_model, sentence):  # experiment block
    sentence_length = len(sentence) - 3
    split_sentence = sentence.split('_')
    weightage = [1, 1]
    word_vector = []
    for w, word in zip(weightage, split_sentence):
        # print(w, word)
        # word = remove_special_characters_and_stopwords(word)
        # print(word)
        word_vector.append(w*get_word_vector(ft_model, word))
    word_vector = np.array(word_vector)
    return word_vector.mean(axis=0)


@api_view(['POST'])
def get_cars(request):
    data = (request.data)
    ft_makes = fasttext.load_model(
        "/Users/devsingh/Desktop/Hackathon-23/MotorMappingBackend/ft_makes.pkl")
    mmfccs_enc = pickle.load(
        open('/Users/devsingh/Desktop/Hackathon-23/MotorMappingBackend/mmfccs_enc.pkl', 'rb'))
    ft_data = pickle.load(
        open('/Users/devsingh/Desktop/Hackathon-23/MotorMappingBackend/ft_data.pkl', 'rb'))

    df = pd.read_csv("policybazar.csv")
    filtered_df = df[df["MAKE"] == data['make']]
    filtered_df = filtered_df[filtered_df["MODEL"] == data['model']]
    n_clus = len(np.unique(filtered_df["VARIANT"]))

    query = f"{data['make']} _ {data['model']} _ {data['variant']}"
    print(query)
    query = find_and_round_number(query)
    print(query)
    query = query.replace("cc)", "").replace("(", "").replace("(", "")
    query = query.lower()
    query_as_list = query.split(" _ ")
    query_for_stage_1 = query_as_list[0] + " _ " + query_as_list[1]
    query_for_state_2 = query

    mmfccs_enc_with_query = mmfccs_enc.copy()
    in_q = False
    if query_for_stage_1 in mmfccs_enc_with_query:
        mmfccs_enc_with_query[query_for_stage_1].append(query_for_state_2)
        in_q = True
    else:
        mmfccs_enc_with_query[query_for_stage_1] = [query_for_state_2]

    if in_q == False:
        query_vec = get_sentence_vector(ft_makes, query_for_stage_1)
        temp_ft_data_list = ft_data.tolist()
        temp_ft_data_list.append(query_vec)
        ft_data_with_vec_query = np.array(temp_ft_data_list)

    else:
        ft_data_with_vec_query = ft_data.copy()

    dbscan_opt = DBSCAN(eps=.21, min_samples=1, n_jobs=8)
    db_model = dbscan_opt.fit(ft_data_with_vec_query)
    cluster_labels = db_model.labels_
    index = list(mmfccs_enc_with_query.keys()).index(query_for_stage_1)
    cars_models = list(mmfccs_enc_with_query.keys())
    index = cluster_labels[index]

    next_step_res = []
    next_step_ins = []
    results = []
    prod_display = []
    for i, idx in enumerate(cluster_labels):
        if idx == index:
            for e in mmfccs_enc_with_query[cars_models[i]]:
                prod_display.append(e)
                res_as_list = e.replace(cars_models[i], "").split(
                    "tmint_tmint")[0].split(" _ ")
                res_as_list_ins = e.replace(
                    cars_models[i], "").split(" _ ")[1:]
                res_as_list_res = e.split(" _ ")
                if len(res_as_list[1:-1]) > 0:
                    next_step_res.append(" ".join(res_as_list[1:-1]).strip())
                else:
                    next_step_res.append(" ".join(res_as_list).strip())

                if len(res_as_list_ins) > 1:
                    next_step_ins.append(
                        f"{res_as_list_ins[0]} {res_as_list_ins[1]} {res_as_list_ins[2]} {' '.join(res_as_list_ins[3].split(' ')[1:])}")
                else:
                    next_step_ins.append(
                        f"{res_as_list_ins[0].strip() + ' tmint_tmint userquery'}")

                if len(res_as_list_res) == 6:
                    results.append(" ".join(res_as_list_res).strip())
                else:
                    results.append(" ".join(res_as_list_res) +
                                   ' tmint_tmint userquery'.strip())

    # Convert the data into feature vectors using TF-IDF vectorizer
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(next_step_res)

    if X.shape[0] <= 1:
        return Response({"message":"Car not found in any insurer!"})

    # Apply K-means clustering
    print(f"running kmeans for {n_clus} clusters")
    kmeans = KMeans(n_clusters=n_clus, n_init="auto")
    kmeans.fit(X)

    # Get the cluster labels
    labels = kmeans.labels_

    # Print the clusters
    assinged_cluster = []
    assigned_prod_cluster = []
    for cluster in labels:
        save_cluster = False
        cluster_data = []
        prod_cluster_data = []
        for i in range(len(next_step_res)):
            if labels[i] == cluster:
                cluster_data.append(results[i].replace("tmint_tmint", "-->"))
                prod_cluster_data.append(prod_display[i])
                if "userquery" in results[i]:
                    save_cluster = True
            if save_cluster:
                assinged_cluster = cluster_data
                assigned_prod_cluster = prod_cluster_data

        print(f"\nCluster: {cluster}")
        print(cluster_data)

    ret = []    
    for c_ in assigned_prod_cluster:
        if len(c_.split("tmint_tmint")) > 1:
            obj = {"make": c_.split("tmint_tmint")[0].split("_")[0].strip(), "model": c_.split("tmint_tmint")[0].split("_")[1].strip(), "variant": c_.split("tmint_tmint")[0].split("_")[2].strip(), "fuel": c_.split("tmint_tmint")[0].split("_")[3].strip(), "cc": c_.split("tmint_tmint")[0].split("_")[4].strip(), "seating": c_.split("tmint_tmint")[0].split("_")[5].strip(), "insurer": c_.split("tmint_tmint")[1].strip()}
            # print(query.replace(" ", ""))
            # print(obj["model"].replace(" ", ""))
            if obj["model"].replace(" ", "") in query.replace(" ", ""):
                print(f"appending {obj}")
                # print(query)
                ret.append(obj)
    return Response({"all_cars": ret})


@api_view(['GET'])
def get_makes(requests):
    df = pd.read_csv("policybazar.csv")
    all_makes = np.unique(df["MAKE"])
    return Response({"all_makes": all_makes})


@api_view(['GET'])
def get_models(requests, make):
    df = pd.read_csv("policybazar.csv")
    filtered_df = df[df["MAKE"] == make]
    all_models = np.unique(filtered_df["MODEL"])
    return Response({"all_models": all_models})


@api_view(['GET'])
def get_fuels(requests, make, model):
    df = pd.read_csv("policybazar.csv")
    filtered_df = df[df["MAKE"] == make]
    filtered_df = filtered_df[filtered_df["MODEL"] == model]
    all_fuels = np.unique(filtered_df["FUEL"])
    return Response({"all_fuels": all_fuels})


@api_view(['GET'])
def get_ccs(requests, make, model, fuel):
    df = pd.read_csv("policybazar.csv")
    filtered_df = df[df["MAKE"] == make]
    filtered_df = filtered_df[filtered_df["MODEL"] == model]
    filtered_df = filtered_df[filtered_df["FUEL"] == fuel]
    all_cc = np.unique(filtered_df["CC"])
    return Response({"all_cc": all_cc})


# @api_view(['GET'])
# def get_transmissions(requests, make, model, fuel, cc):
#     df = pd.read_csv("policybazar.csv")
#     filtered_df = df[df["MAKE"] == make]
#     filtered_df = filtered_df[filtered_df["MODEL"] == model]
#     filtered_df = filtered_df[filtered_df["FUEL"] == fuel]
#     filtered_df = filtered_df[filtered_df["CC"] == cc]
#     all_transmission = np.unique(filtered_df["TRANSMISSION"])
#     print(all_transmission)
#     return Response({"all_transmission": all_transmission})

@api_view(['GET'])
def get_variants(requests, make, model, fuel, cc):
    df = pd.read_csv("policybazar.csv")
    filtered_df = df[df["MAKE"] == make]
    filtered_df = filtered_df[filtered_df["MODEL"] == model]
    filtered_df = filtered_df[filtered_df["FUEL"] == fuel]
    filtered_df = filtered_df[filtered_df["CC"] == float(cc)]
    all_variants = np.unique(filtered_df["VARIANT"])
    return Response({"all_variants": all_variants})


@api_view(['POST'])
def get_summary(requests):
    pdf_file = requests.FILES["file"]
    os.environ["OPENAI_API_KEY"] = "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"

    with open("temp.pdf", 'wb') as file:
        file.write(pdf_file.read())

    loader = PyPDFLoader("temp.pdf")
    documents = loader.load()

    # split into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings()

    db = Chroma.from_documents(texts, embeddings)

    retriever = db.as_retriever(search_by="similarity", search_kwargs={"k": 2})

    qa = ConversationalRetrievalChain.from_llm(OpenAI(), retriever)

    chat_history = []
    query_coverage = "What is the coverage amount of this policy?"
    result_coverage = qa({"question": query_coverage, "chat_history": chat_history})

    query_type = "What is the policy type?"
    result_type = qa({"question": query_type, "chat_history": chat_history})

    query_premium = "What are the premiums of this policy?"
    result_premium = qa({"question": query_premium, "chat_history": chat_history})

    query_duration = "What is the duration of this policy?"
    result_duration = qa({"question": query_duration, "chat_history": chat_history})

    query_benefits = "What are the benefits of this policy?"
    result_benefits = qa({"question": query_benefits, "chat_history": chat_history})

    query_med_ex = "Are there any medical examinations required for this policy?"
    result_med_ex = qa({"question": query_med_ex, "chat_history": chat_history})

    query_limit = "What are the exclusions and limitations of this policy?"
    result_limit = qa({"question": query_limit, "chat_history": chat_history})

    query_flexi = "What is the flexibility of this policy?"
    result_flexi = qa({"question": query_flexi, "chat_history": chat_history})

    query_net = "Who are the network of providers for this policy?"
    result_net = qa({"question": query_net, "chat_history": chat_history})

    query_general = "Give a general summary about the document"
    result_general = qa({"question": query_general, "chat_history": chat_history})

    res = {
        "policy_coverage": result_coverage,
        "policy_type": result_type,
        "policy_premium": result_premium,
        "policy_duration": result_duration,
        "policy_benefits": result_benefits,
        "policy_med_ex": result_med_ex,
        "policy_limit": result_limit,
        "policy_flexi": result_flexi,
        "policy_net": result_net,
        "general_summary": result_general
    }

    print(res)
    return Response({"bitsized": res})