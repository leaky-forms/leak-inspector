function checkRequest(request, inputElements, tdsResult, timeStamp, requestBaseDomain) {
  const searchTerms = inputElements.inputFields.map((inputEl) => inputEl.value);
  const leak_detector = new LeakDetector(
    searchTerms,
    (precompute_hashes = true),
    (hash_set = LIKELY_HASHES),
    (hash_layers = 3),
    (precompute_encodings = true),
    (encoding_set = ENCODINGS_NO_ROT),
    (encoding_layers = 3),
    (debugging = false)
  );
  const url_leaks = leak_detector.check_url(request.url, (encoding_layers = 3));
  if (url_leaks.size) {
    console.log("URL leak occured by tracker domain:", timeStamp, url_leaks);
    console.log(tdsResult);
    return {
      block: true,
      type: "Tracker Domain",
      timeStamp,
      domain: requestBaseDomain,
      trackerDetails: tdsResult ? tdsResult.tracker : undefined,
      inputFields: inputElements.inputFields.filter(el => [...url_leaks].some(leak => leak.includes(el.value)))
    };
  }

  let requestBodies = [];
  const reqBody = request.requestBody;
  if (request.method == "POST" && reqBody) {
    if (reqBody.raw) {
      try {
        requestBodies = reqBody.raw.map(function (data) {
          return decodeRequestBody(data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  for (const reqBody of requestBodies) {
    const postLeaks = leak_detector.check_post_data(
      reqBody,
      (encoding_layers = 3)
    );
    if (postLeaks.size) {
      console.log(
        "POST body leak to tracker domain ",
        timeStamp,
        postLeaks
      );
      console.log(tdsResult);
      return {
        block: true,
        type: "Tracker Domain",
        timeStamp,
        domain: requestBaseDomain,
        trackerDetails: tdsResult ? tdsResult.tracker : undefined,
        inputFields: inputElements.inputFields.filter(
          el => [...postLeaks].some(leak => leak.includes(el.value))
        )
      };
    }
  }
  return {
    block: false,
  };
}
