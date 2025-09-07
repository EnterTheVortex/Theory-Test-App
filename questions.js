// DVSA-style Theory Test Questions
const questionsBank = [ ... ];
  // ROAD SIGNS
  {
    category: "Road Signs",
    question: "What does a circular road sign with a red border mean?",
    options: [
      "It gives an order",
      "It provides information",
      "It gives a warning",
      "It shows directions"
    ],
    answer: 0
  },
  {
    category: "Road Signs",
    question: "You see a triangular sign with a red border and a picture of a deer. What does this mean?",
    options: [
      "No entry for farm vehicles",
      "Animals may be on the road",
      "Deer crossing ahead",
      "Nature reserve nearby"
    ],
    answer: 2
  },
  // SAFETY & HAZARD AWARENESS
  {
    category: "Hazard Awareness",
    question: "You are driving and your mobile phone rings. What should you do?",
    options: [
      "Answer the call quickly",
      "Stop in a safe place before answering",
      "Reduce your speed and answer",
      "Put the phone on loudspeaker while driving"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "You’re approaching a zebra crossing. A pedestrian is waiting to cross. What should you do?",
    options: [
      "Wave them to cross quickly",
      "Stop and wait patiently until they cross",
      "Sound your horn to let them know you’re there",
      "Continue driving unless they step onto the crossing"
    ],
    answer: 1
  },
  // RULES OF THE ROAD
  {
    category: "Rules of the Road",
    question: "On a motorway, what is the national speed limit for cars and motorcycles?",
    options: [
      "50 mph",
      "60 mph",
      "70 mph",
      "80 mph"
    ],
    answer: 2
  },
  {
    category: "Rules of the Road",
    question: "You are on a dual carriageway with a 70 mph speed limit. When may you use the right-hand lane?",
    options: [
      "To overtake slower vehicles",
      "At any time, even if not overtaking",
      "When driving at the speed limit",
      "Only if your vehicle is a motorcycle"
    ],
    answer: 0
  },
  // VEHICLE HANDLING
  {
    category: "Vehicle Handling",
    question: "In icy conditions, what is the safest way to brake?",
    options: [
      "Brake gently and in good time",
      "Apply the handbrake firmly",
      "Brake quickly and firmly",
      "Use the gears only to slow down"
    ],
    answer: 0
  },
  {
    category: "Vehicle Handling",
    question: "When driving in fog, why is it important to keep a safe distance from the vehicle in front?",
    options: [
      "So they can see you more easily",
      "Because it’s harder to judge distances in fog",
      "So you can accelerate more quickly",
      "To reduce fuel consumption"
    ],
    answer: 1
  },
  // ESSENTIAL DOCUMENTS
  {
    category: "Essential Documents",
    question: "When must you have valid motor insurance?",
    options: [
      "Only when driving on motorways",
      "Before you can legally drive on public roads",
      "Only when carrying passengers",
      "Only when driving long distances"
    ],
    answer: 1
  },
  {
    category: "Essential Documents",
    question: "What does a vehicle’s MOT certificate confirm?",
    options: [
      "That the vehicle is insured",
      "That the vehicle is roadworthy at the time of the test",
      "That the vehicle tax is up to date",
      "That the driver has a valid licence"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "You are driving and notice your tyres are aquaplaning. What should you do?",
    options: [
      "Brake hard immediately",
      "Ease off the accelerator and steer straight",
      "Accelerate to regain control",
      "Turn the steering sharply"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A vehicle ahead suddenly stops. You should:",
    options: [
      "Swerve around it quickly",
      "Brake gently and maintain control",
      "Sound horn and overtake",
      "Accelerate past"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "When approaching a pedestrian crossing with people waiting, you should:",
    options: [
      "Stop and allow them to cross",
      "Proceed if no one has stepped onto the crossing",
      "Accelerate past quickly",
      "Sound horn to warn them"
    ],
    answer: 0
  },
  {
    category: "Hazard Awareness",
    question: "You see a cyclist indicating left but moving right. You should:",
    options: [
      "Overtake immediately",
      "Stay back and give way if necessary",
      "Sound horn and overtake",
      "Maintain speed and pass closely"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "In heavy rain, what is the safest following distance?",
    options: [
      "Normal distance",
      "Double the usual distance",
      "Half the usual distance",
      "Distance does not matter"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A pedestrian with a white cane is crossing. You should:",
    options: [
      "Stop and allow them to cross",
      "Sound horn and continue",
      "Drive past slowly",
      "Wave them to hurry"
    ],
    answer: 0
  },
  {
    category: "Hazard Awareness",
    question: "You notice ice on a bridge. You should:",
    options: [
      "Brake firmly before crossing",
      "Slow down and drive cautiously",
      "Maintain normal speed",
      "Accelerate to cross quickly"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A vehicle is parked with hazard lights on. You should:",
    options: [
      "Overtake quickly",
      "Reduce speed and pass carefully",
      "Ignore them",
      "Stop immediately"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "You are approaching a junction and the vehicle in front is signalling left. Suddenly, it turns right. You should:",
    options: [
      "Overtake immediately",
      "Stay cautious and be prepared to stop",
      "Sound horn and pass",
      "Follow closely"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A vehicle in front flashes hazard lights on a motorway. You should:",
    options: [
      "Change lane immediately",
      "Reduce speed and move over safely",
      "Maintain speed",
      "Accelerate past"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "You notice a cyclist swerving unexpectedly. You should:",
    options: [
      "Sound horn",
      "Slow down and give them space",
      "Overtake quickly",
      "Follow closely"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A vehicle suddenly reverses from a driveway. You should:",
    options: [
      "Brake and give way",
      "Accelerate past",
      "Sound horn and maintain speed",
      "Swerve around"
    ],
    answer: 0
  },
  {
    category: "Hazard Awareness",
    question: "You are driving in fog. Which lights should you use?",
    options: [
      "Full beam headlights",
      "Dipped headlights",
      "Hazard lights only",
      "Side lights only"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A child suddenly runs onto the road. You should:",
    options: [
      "Sound horn",
      "Brake gently and stop if necessary",
      "Swerve around quickly",
      "Accelerate past"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "On a wet road, what is the safest braking method?",
    options: [
      "Brake firmly",
      "Brake gently and early",
      "Pump brakes rapidly",
      "Use handbrake only"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A pedestrian crossing has a flashing amber light. You should:",
    options: [
      "Stop regardless",
      "Stop only if pedestrians are crossing",
      "Accelerate to cross quickly",
      "Sound horn before crossing"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "You approach a roundabout where a driver is signalling incorrectly. You should:",
    options: [
      "Overtake quickly",
      "Wait and be cautious",
      "Sound horn and proceed",
      "Maintain speed and enter"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A parked vehicle opens a door unexpectedly. You should:",
    options: [
      "Swerve immediately",
      "Brake and move away carefully",
      "Sound horn and pass",
      "Accelerate past quickly"
    ],
    answer: 1
  },
  // ----------------- RULES OF THE ROAD (111–170) -----------------
  {
    category: "Rules of the Road",
    question: "At a give-way junction, you must:",
    options: [
      "Give way to traffic on the major road",
      "Proceed without stopping",
      "Give way only to pedestrians",
      "Stop regardless of traffic"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "On a roundabout, who has priority?",
    options: [
      "Traffic approaching from the right",
      "Traffic already on the roundabout",
      "Cyclists only",
      "Vehicles signalling left"
    ],
    answer: 1
  },
  {
    category: "Rules of the Road",
    question: "You are overtaking on a dual carriageway. You must:",
    options: [
      "Ensure clear visibility ahead",
      "Overtake on the left",
      "Honk to alert the vehicle ahead",
      "Overtake at maximum speed"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "The national speed limit on a single carriageway for cars is:",
    options: [
      "50 mph",
      "60 mph",
      "70 mph",
      "80 mph"
    ],
    answer: 1
  },
  {
    category: "Rules of the Road",
    question: "When can you use a hard shoulder on a motorway?",
    options: [
      "Only in an emergency",
      "To overtake slow traffic",
      "To rest temporarily",
      "During heavy congestion"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "A solid white line along the edge of the road indicates:",
    options: [
      "Edge of carriageway",
      "No overtaking",
      "Pedestrian zone",
      "Parking restriction"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "At a pelican crossing, the light changes from green to flashing amber. You should:",
    options: [
      "Stop and wait",
      "Proceed if clear",
      "Accelerate through",
      "Turn around"
    ],
    answer: 1
  },
  {
    category: "Rules of the Road",
    question: "The correct hand signal for a left turn is:",
    options: [
      "Left arm straight out",
      "Left arm bent upward",
      "Right arm straight out",
      "Right arm bent upward"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "Overtaking a horse and rider requires:",
    options: [
      "Overtake quickly at normal speed",
      "Slow down and give plenty of space",
      "Sound horn to alert them",
      "Drive close to pass safely"
    ],
    answer: 1
  },
  {
    category: "Rules of the Road",
    question: "You approach traffic lights showing red and amber together. You should:",
    options: [
      "Stop and wait for green",
      "Proceed if clear",
      "Prepare to move, but do not go yet",
      "Turn around"
    ],
    answer: 2
  },
  // ----------------- VEHICLE HANDLING (171–205) -----------------
  {
    category: "Vehicle Handling",
    question: "If your car begins to skid on ice, you should:",
    options: [
      "Turn steering into the skid",
      "Brake hard immediately",
      "Steer away from skid",
      "Shift into neutral"
    ],
    answer: 0
  },
  {
    category: "Vehicle Handling",
    question: "Before a long journey, you should check:",
    options: [
      "Tires, lights, oil, coolant, and fuel",
      "Only fuel and oil",
      "Only tires and brakes",
      "Nothing if new car"
    ],
    answer: 0
  },
  {
    category: "Vehicle Handling",
    question: "Engine overheating warning appears. You should:",
    options: [
      "Stop safely and allow engine to cool",
      "Continue driving",
      "Add water while engine running",
      "Accelerate to cool engine"
    ],
    answer: 0
  },
  {
    category: "Vehicle Handling",
    question: "Spongy brakes indicate you should:",
    options: [
      "Continue driving",
      "Check brake fluid and service brakes",
      "Pump brakes while driving",
      "Use handbrake only"
    ],
    answer: 1
  },
  {
    category: "Vehicle Handling",
    question: "Correct tyre pressure ensures:",
    options: [
      "Better fuel economy and safe handling",
      "Longer service intervals",
      "Smoother ride only",
      "No effect if driving slowly"
    ],
    answer: 0
  },
  // ----------------- ESSENTIAL DOCUMENTS (206–250) -----------------
  {
    category: "Essential Documents",
    question: "You must carry your driving licence at all times:",
    options: [
      "Only on long journeys",
      "Only on motorways",
      "Always when driving",
      "Never; digital copy suffices"
    ],
    answer: 2
  },
  {
    category: "Essential Documents",
    question: "Vehicle excise duty (road tax) must be:",
    options: [
      "Paid before using vehicle on public roads",
      "Paid only if driving on motorways",
      "Paid once every two years",
      "Not required if insured"
    ],
    answer: 0
  },
  {
    category: "Essential Documents",
    question: "If your insurance expires, you should:",
    options: [
      "Drive carefully",
      "Renew insurance before driving",
      "Drive only during daylight",
      "Carry photocopy of old insurance"
    ],
    answer: 1
  },
  {
    category: "Essential Documents",
    question: "An MOT certificate confirms that a vehicle:",
    options: [
      "Meets road safety and environmental standards",
      "Is fully insured",
      "Is registered with DVLA",
      "Has been serviced recently"
    ],
    answer: 0
  },
  {
    category: "Essential Documents",
    question: "A vehicle’s V5C registration document shows:",
    options: [
      "Owner and vehicle details",
      "Insurance details",
      "MOT expiry date",
      "Tax payments"
    ],
    answer: 0
  },
  {
    category: "Road Signs",
    question: "A blue rectangular sign with a white 'P' indicates what?",
    options: [
      "Hospital nearby",
      "Parking area",
      "Pedestrian crossing",
      "Police station"
    ],
    answer: 1
  },
  {
    category: "Road Signs",
    question: "A red triangle with a black cross in the centre warns you of:",
    options: [
      "Railway crossing without barrier",
      "Accident-prone area",
      "Crossroads ahead",
      "Roadworks"
    ],
    answer: 2
  },
  {
    category: "Road Signs",
    question: "What does a circular blue sign with a white arrow pointing left mean?",
    options: [
      "Turn left ahead",
      "Keep left",
      "No left turn",
      "One-way road"
    ],
    answer: 1
  },
  {
    category: "Road Signs",
    question: "A yellow diamond-shaped sign with a black border usually indicates:",
    options: [
      "Warning",
      "Prohibition",
      "Mandatory instruction",
      "Information"
    ],
    answer: 0
  },
  {
    category: "Road Signs",
    question: "What does a white rectangular sign with a red circle around a bicycle mean?",
    options: [
      "Cyclists prohibited",
      "Cycle lane ahead",
      "No parking for bicycles",
      "Cycle route"
    ],
    answer: 0
  },
  // ---------------- HAZARD AWARENESS ----------------
  {
    category: "Hazard Awareness",
    question: "You are driving on a wet road. Your vehicle starts to skid. What should you do?",
    options: [
      "Brake hard immediately",
      "Turn the steering wheel sharply",
      "Ease off the accelerator and steer in the direction of the skid",
      "Accelerate to regain traction"
    ],
    answer: 2
  },
  {
    category: "Hazard Awareness",
    question: "You notice a vehicle ahead flashing hazard lights. This indicates:",
    options: [
      "They want you to overtake",
      "They have an emergency or hazard",
      "They are speeding up",
      "They are stopping at a junction"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "When driving at night, what should you do if an oncoming vehicle's headlights dazzle you?",
    options: [
      "Look straight ahead",
      "Flash your headlights",
      "Look to the left and reduce speed",
      "Honk immediately"
    ],
    answer: 2
  },
  {
    category: "Hazard Awareness",
    question: "In fog, which lights should you use when visibility is seriously reduced?",
    options: [
      "Full beam headlights",
      "Front and rear fog lights",
      "Parking lights only",
      "Hazard lights"
    ],
    answer: 1
  },
  {
    category: "Hazard Awareness",
    question: "A pedestrian suddenly steps onto the road. Your immediate action should be:",
    options: [
      "Swerve around quickly",
      "Brake safely and be prepared to stop",
      "Accelerate past",
      "Sound horn and continue"
    ],
    answer: 1
  },
  // ---------------- RULES OF THE ROAD ----------------
  {
    category: "Rules of the Road",
    question: "When entering a motorway, you should:",
    options: [
      "Stop at the start of the slip road",
      "Accelerate to match the speed of traffic",
      "Drive slowly and merge carefully",
      "Wait for a traffic signal"
    ],
    answer: 1
  },
  {
    category: "Rules of the Road",
    question: "When approaching a roundabout with no signs or markings, who has priority?",
    options: [
      "Traffic already on the roundabout",
      "Traffic entering from the left",
      "Pedestrians",
      "Cyclists only"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "What does a single solid white line down the centre of the road indicate?",
    options: [
      "You may overtake freely",
      "Do not overtake or cross unless safe",
      "Parking allowed",
      "Pedestrian crossing ahead"
    ],
    answer: 1
  },
  {
    category: "Rules of the Road",
    question: "You are turning right at a junction. You must:",
    options: [
      "Give way to oncoming traffic",
      "Always go first",
      "Sound horn to warn oncoming vehicles",
      "Drive in the left lane"
    ],
    answer: 0
  },
  {
    category: "Rules of the Road",
    question: "When must you stop at a stop sign?",
    options: [
      "Only if traffic is present",
      "Always, before the line",
      "If pedestrians are crossing",
      "Only during daylight"
    ],
    answer: 1
  },
  // ---------------- VEHICLE HANDLING ----------------
  {
    category: "Vehicle Handling",
    question: "What is the correct procedure when approaching a bend on a slippery road?",
    options: [
      "Brake while turning",
      "Slow down before the bend and steer smoothly",
      "Accelerate into the bend",
      "Turn sharply to avoid skidding"
    ],
    answer: 1
  },
  {
    category: "Vehicle Handling",
    question: "When driving downhill, you should:",
    options: [
      "Use engine braking and lower gears",
      "Brake continuously",
      "Shift into neutral",
      "Brake only at the bottom"
    ],
    answer: 0
  },
  {
    category: "Vehicle Handling",
    question: "What should you check before starting a long journey?",
    options: [
      "Tyre pressure, fuel, lights, oil, and coolant",
      "Only fuel and lights",
      "Only tyres",
      "Nothing if the car is new"
    ],
    answer: 0
  },
  {
    category: "Vehicle Handling",
    question: "When turning sharply, the most important consideration is:",
    options: [
      "Maintain speed",
      "Steer smoothly and control the vehicle",
      "Brake hard",
      "Accelerate quickly"
    ],
    answer: 1
  },
  {
    category: "Vehicle Handling",
    question: "ABS braking system helps to:",
    options: [
      "Increase stopping distance",
      "Prevent wheels from locking during braking",
      "Steer off the road",
      "Reduce tyre pressure"
    ],
    answer: 1
  },
  // ---------------- ESSENTIAL DOCUMENTS ----------------
  {
    category: "Essential Documents",
    question: "Before driving on public roads, you must have:",
    options: [
      "Valid insurance, MOT (if required), and licence",
      "Only insurance",
      "Only MOT certificate",
      "No documents required"
    ],
    answer: 0
  },
  {
    category: "Essential Documents",
    question: "If you change your vehicle’s address, you must update:",
    options: [
      "Your MOT certificate",
      "Your insurance only",
      "Your V5C registration document",
      "Your driving licence only"
    ],
    answer: 2
  },
  {
    category: "Essential Documents",
    question: "Driving without insurance can result in:",
    options: [
      "A fine and points on licence",
      "Nothing if careful",
      "A warning letter only",
      "Only legal action if an accident occurs"
    ],
    answer: 0
  },
  {
    category: "Essential Documents",
    question: "An MOT certificate is valid for how long?",
    options: [
      "1 year",
      "2 years",
      "6 months",
      "Until the next owner"
    ],
    answer: 0
  },
  {
    category: "Essential Documents",
    question: "Which document shows the registered keeper of the vehicle?",
    options: [
      "Insurance certificate",
      "V5C registration document",
      "Driving licence",
      "MOT certificate"
    ],
    answer: 1
  }
];
