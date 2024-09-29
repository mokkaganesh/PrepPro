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
import { useState, useEffect } from "react";
import db from "@/utils/db";
import { ne, eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import GlobalApi from "@/utils/GlobalApi";
import { useUser } from "@clerk/nextjs";

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

function MatchingPeopleTable() {
  const [data, setData] = useState([]); // All user data fetched from the database
  const [matchingPeople, setMatchingPeople] = useState([]); // Filtered list of matching people
  const [invitesSent, setInvitesSent] = useState([]); // Track invites sent to each person
  const [yourSkills1, setYourSkills1] = useState([]); // Your skills state
  const user = useUser().user; // Clerk user

  // Fetch all users' emails and skills
  const GetAllUsersEmailsAndSkills = async () => {
    try {
      const result = await db
        .select({
          email: MockInterview.createdBy,  // Assuming 'createdBy' stores the user's email
          skills: MockInterview.jopDesc,   // Using 'jobDesc' as skills
        })
        .from(MockInterview)
        .where(ne(MockInterview.createdBy, user?.emailAddresses[0].emailAddress)); // Exclude yourself

      const yourresult = await db
        .select({
          email: MockInterview.createdBy,  // Assuming 'createdBy' stores the user's email
          skills: MockInterview.jopDesc,   // Using 'jobDesc' as skills
        })
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.emailAddresses[0].emailAddress)); // Only yourself

      // Clean up and store other users' data
      const fetchedData = result.map(val => {
        const cleanedSkills = val.skills.split(',').map(skill => skill.trim());
        return {
          mail: val.email,
          skills: cleanedSkills,
        };
      });

      // Set your skills (the logged-in user)

    if (yourresult.length > 0) {
      // Combine all skills from the result into one array
      const combinedYourSkills = yourresult.reduce((acc, val) => {
        const cleanedSkills = val.skills.split(',').map(skill => skill.trim());
        return [...acc, ...cleanedSkills]; // Accumulate skills
      }, []);

      // Remove duplicates from the combined skills
      const uniqueSkills = [...new Set(combinedYourSkills)];

      setYourSkills1(uniqueSkills); // Update your skills state with unique skills
    }


      // Set fetched users data to the state
      setData(fetchedData);

    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  };

  // Fetch data once when the component mounts
  useEffect(() => {
    GetAllUsersEmailsAndSkills();
  }, [user]);

  // Compute matching people when data changes
  useEffect(() => {
    console.log(data);
    console.log(yourSkills1);
    if (data.length > 0 && yourSkills1.length > 0) {
      const minSimilarity = 0.0;

      // Filter people with more than 50% similarity
      const matched = data.filter(person => {
        const similarity = cosineSimilarity(yourSkills1, person.skills);
        return similarity >= minSimilarity;
      }).map(person => ({
        ...person,
        similarity: (cosineSimilarity(yourSkills1, person.skills) * 100).toFixed(2) + '%',
      }));

      setMatchingPeople(matched);
      setInvitesSent(Array(matched.length).fill(false)); // Initialize invites state
    }
  }, [data, yourSkills1]);

  // Handle invite button click
  const handleInvite = (email, index) => {
    alert(`Invitation sent successfully to ${email}`);

    // Update the invite status for the person at the current index
    const updatedInvites = [...invitesSent];
    updatedInvites[index] = true;
    setInvitesSent(updatedInvites);

    // Send email invite through GlobalApi
    GlobalApi.sendEmailThroughClerk(email);
  };

  return (
    <div className="w-full max-w-full px-4 py-2">
      <Table className="min-w-full table-auto border-collapse border border-gray-300">
        <TableCaption className="text-lg font-semibold text-gray-700">
          People with more than 50% skill match
        </TableCaption>
        <TableHeader className="bg-gray-100 border-b border-gray-300">
          <TableRow>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Email</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Matching Percentage</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Skills</TableHead>
            <TableHead className="p-4 border border-gray-300 text-left text-black font-bold">Invite</TableHead>
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
                  onClick={() =>user &&handleInvite(person.mail, index)}
                  disabled={invitesSent[index]}  // Disable the button if the invite has been sent
                >
                  {invitesSent[index] ? "Invited" : "Start Interview"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-gray-100">
            <TableCell colSpan={2} className="p-4 border border-gray-300 font-semibold text-right">
              Total Matches
            </TableCell>
            <TableCell className="p-4 border border-gray-300 text-right">
              {matchingPeople.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default MatchingPeopleTable;
