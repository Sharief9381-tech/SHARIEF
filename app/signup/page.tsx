"use client"

import React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Loader2, GraduationCap, Building2, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import Loading from "./loading"

type Role = "student" | "college" | "recruiter"

const roles = [
  {
    id: "student" as Role,
    label: "Student",
    description: "Track your coding progress and get matched with jobs",
    icon: GraduationCap,
  },
  {
    id: "college" as Role,
    label: "College",
    description: "Monitor student performance and manage placements",
    icon: Building2,
  },
  {
    id: "recruiter" as Role,
    label: "Recruiter",
    description: "Find and hire top coding talent with AI matching",
    icon: Briefcase,
  },
]

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    collegeCode: "",
    rollNumber: "",
    branch: "",
    graduationYear: "",
    // College specific
    collegeName: "",
    location: "",
    // Recruiter specific
    companyName: "",
    designation: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role") as Role | null
    if (roleParam && roles.some((r) => r.id === roleParam)) {
      setSelectedRole(roleParam)
      setStep("details")
    }
  }, [searchParams])

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      // Redirect to the URL provided by the API
      if (data.redirectTo) {
        router.push(data.redirectTo)
      } else {
        // Fallback redirect based on user role
        router.push(`/${selectedRole}/dashboard`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CodeTrack</span>
          </Link>
        </div>

        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === "role" ? "Join CodeTrack" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {step === "role"
                ? "Select your role to get started"
                : `Sign up as a ${selectedRole}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "role" ? (
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors text-left",
                      selectedRole === role.id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <role.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{role.label}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Role-specific fields */}
                {selectedRole === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="collegeCode">College Code</Label>
                      <Input
                        id="collegeCode"
                        placeholder="IITD (e.g., IITD, NITK, BITS)"
                        value={formData.collegeCode}
                        onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your college's unique code. Contact your college if you don't know it.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        placeholder="21CS001 (e.g., 21CS001, 2021BCS001)"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your college roll number for easy identification.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input
                          id="branch"
                          placeholder="CSE"
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          placeholder="2026"
                          value={formData.graduationYear}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === "college" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="collegeName">College Name</Label>
                      <Input
                        id="collegeName"
                        placeholder="Indian Institute of Technology Delhi"
                        value={formData.collegeName}
                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collegeCode">College Code</Label>
                      <Input
                        id="collegeCode"
                        placeholder="IITD"
                        value={formData.collegeCode}
                        onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This unique code will be used by students to identify your college.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="New Delhi, India"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {selectedRole === "recruiter" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Tech Corp"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        placeholder="HR Manager"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("role")
                      setSelectedRole(null)
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupForm />
    </Suspense>
  )
}
