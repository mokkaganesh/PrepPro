"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";


// Matching data (generated from the cosine similarity algorithm)
/*const matchingPeople = [
  { mail: 'person1@mail.com', similarity: '66.67%', skills: ['javascript', 'react', 'html', 'python'] },
  { mail: 'person3@mail.com', similarity: '83.33%', skills: ['javascript', 'nodejs', 'html', 'css'] },
  { mail: 'person6@mail.com', similarity: '91.67%', skills: ['javascript', 'react', 'nodejs', 'express', 'css'] },
  { mail: 'person7@mail.com', similarity: '60.00%', skills: ['html', 'css', 'javascript'] },
  { mail: 'person8@mail.com', similarity: '75.00%', skills: ['nodejs', 'react', 'express'] },
  { mail: 'person9@mail.com', similarity: '85.00%', skills: ['javascript', 'html', 'css', 'react'] },
  { mail: 'person10@mail.com', similarity: '55.00%', skills: ['python', 'django', 'html'] },
  { mail: 'person11@mail.com', similarity: '80.00%', skills: ['nodejs', 'html', 'express', 'css'] },
  { mail: 'person12@mail.com', similarity: '78.00%', skills: ['javascript', 'angular', 'css'] },
  { mail: 'person13@mail.com', similarity: '59.00%', skills: ['vue', 'javascript', 'css', 'html'] },
  { mail: 'person14@mail.com', similarity: '62.00%', skills: ['javascript', 'react', 'css', 'tailwind'] },
  { mail: 'person15@mail.com', similarity: '77.00%', skills: ['html', 'css', 'react', 'express'] },
  { mail: 'person16@mail.com', similarity: '82.00%', skills: ['javascript', 'vue', 'html', 'tailwind'] },
  { mail: 'person17@mail.com', similarity: '73.00%', skills: ['html', 'css', 'nodejs', 'express'] },
  { mail: 'person18@mail.com', similarity: '64.00%', skills: ['javascript', 'react', 'tailwind', 'css'] },
  { mail: 'person19@mail.com', similarity: '68.00%', skills: ['javascript', 'html', 'css', 'vue'] },
  { mail: 'person20@mail.com', similarity: '70.00%', skills: ['python', 'django', 'javascript'] },
];
*/

// Assume you have your own skills as a reference
const yourSkills = ['javascript', 'react', 'nodejs', 'html', 'css', 'python']; 

// Assume this is the data of other people
const data = [
  { mail: 'person1@mail.com', skills: ['javascript', 'react', 'html', 'python'] },
  { mail: 'person2@mail.com', skills: ['java', 'spring', 'hibernate'] },
  { mail: 'person3@mail.com', skills: ['javascript', 'nodejs', 'html', 'css'] },
  { mail: 'person4@mail.com', skills: ['python', 'django', 'flask'] },
  { mail: 'person5@mail.com', skills: ['javascript', 'vue', 'html', 'css'] },
  { mail: 'person6@mail.com', skills: ['javascript', 'react', 'nodejs', 'express', 'css'] },
  { mail: 'person7@mail.com', skills: ['c++', 'c#', 'unity'] },
  { mail: 'person8@mail.com', skills: ['nodejs', 'express', 'mongodb'] },
  { mail: 'person9@mail.com', skills: ['html', 'css', 'javascript', 'angular'] },
  { mail: 'person10@mail.com', skills: ['python', 'data science', 'machine learning'] },
];

// Cosine Similarity Function to find the similarity between skill arrays
function cosineSimilarity(arr1, arr2) {
  const set = new Set([...arr1, ...arr2]);
  const vec1 = [...set].map(skill => (arr1.includes(skill) ? 1 : 0));
  const vec2 = [...set].map(skill => (arr2.includes(skill) ? 1 : 0));
  const dotProduct = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

// Minimum similarity percentage to be considered a match
const minSimilarity = 0.5;

// Check all people whose skills match more than 50% with yours
const matchingPeople = data.filter(person => {
  const similarity = cosineSimilarity(yourSkills, person.skills);
  return similarity >= minSimilarity;
}).map(person => ({
  mail: person.mail,
  similarity: (cosineSimilarity(yourSkills, person.skills) * 100).toFixed(2) + '%',
  skills: person.skills,
}));

console.log('Matching People:', matchingPeople);


function MatchingPeopleTable() {
  // Initialize state to track invites for each person
  const [invitesSent, setInvitesSent] = useState(Array(matchingPeople.length).fill(false));


    // Function to handle sending an invite


  const handleInvite = (email, index) => {
    alert(`Invitation sent successfully to ${email}`);
    
    // Update the invite status for the person at the current index
    const updatedInvites = [...invitesSent];
    updatedInvites[index] = true;
    setInvitesSent(updatedInvites);

  };

  return (
    <div className="w-full max-w-full px-4 py-2">
      <Table className="min-w-full table-auto border-collapse border border-gray-300">
        <TableCaption className="text-lg font-semibold text-gray-700">People with more than 50% skill match</TableCaption>
        <TableHeader className="bg-gray-100 border-b border-gray-300">
          <TableRow>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Email</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Matching Percentage</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Skills</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Invite</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchingPeople.map((person, index) => (
            <TableRow key={person.mail} className="hover:bg-gray-50">
              <TableCell className="p-4 border border-gray-300 font-medium text-gray-700">{person.mail}</TableCell>
              <TableCell className="p-4 border border-gray-300 text-gray-700">{person.similarity}</TableCell>
              <TableCell className="p-4 border border-gray-300 text-gray-700">{person.skills.join(', ')}</TableCell>
              <TableCell className="p-4 border border-gray-300 text-gray-700">
                <Button
                  onClick={() => handleInvite(person.mail, index)}
                  disabled={invitesSent[index]}  // Disable the button if the invite has been sent
                >
                  {invitesSent[index] ? "Invited" : "Start Interview"}
                </Button>
              </TableCell>
              <TableCell className="p-4 border border-gray-300 text-gray-700"></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-gray-100">
            <TableCell colSpan={2} className="p-4 border border-gray-300 font-semibold text-right">Total Matches</TableCell>
            <TableCell className="p-4 border border-gray-300 text-right">{matchingPeople.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default MatchingPeopleTable;
